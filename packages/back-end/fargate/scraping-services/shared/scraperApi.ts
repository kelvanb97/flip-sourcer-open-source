import axiosRetry from "axios-retry";
import axios, { AxiosError } from "axios";
import jsdom from "jsdom";
import { ScraperApiCountry } from "../../../../types/ScraperApi";
import { scraperApiApiKey } from "../../../shared/envVars";
import { handleLogging, LoggingProps } from "../../../shared/logging";

const axiosScraperApiInstance = axios.create();

axiosRetry(axiosScraperApiInstance, {
  retries: 3,
  retryCondition: (error) => {
    // retry for 429 and 5xx responses
    if (
      error.response &&
      (error.response.status === 429 ||
        (error.response.status >= 500 && error.response.status <= 599))
    ) {
      console.log(
        `Retrying scraperApi request. Status: ${error.response.status}`
      );
      return true;
    } else {
      if (!error.response)
        console.log(`Not retrying scraperApi request. No response.`);
      else
        console.log(
          `Not retrying scraperApi request. Status: ${error.response.status}`
        );
      return false;
    }
  },
  retryDelay: axiosRetry.exponentialDelay, // exponential back-off 1, 2, 4, 8, etc. seconds
});

type ScraperApiResponse<T> = T | null;

interface HandleFinalResponseProps<T> {
  loggingProps: LoggingProps | null;
  caller: string;
  status: number | null;
  data: T;
}

function handleFinalResponse<T>({
  loggingProps,
  caller,
  status,
  data,
}: HandleFinalResponseProps<T>): ScraperApiResponse<T> {
  handleLogging(loggingProps);

  if (status === 200) {
    return data;
  } else if (status === 403) {
    console.log(
      `${caller} | status: ${status} | You have used up all your API credits.`
    );
    return null;
  } else if (status === 404) {
    console.log(
      `${caller} | status: ${status} | Page requested does not exist.`
    );
    return null;
  } else if (status === 410) {
    console.log(
      `${caller} | status: ${status} | Page requested is no longer available.`
    );
    return null;
  } else if (status === 429) {
    console.log(
      `${caller} | status: ${status} | You are sending requests too fast, and exceeding your concurrency limit.`
    );
    return null;
  } else if (status === 500) {
    console.log(
      `${caller} | status: ${status} | After retrying for 60 seconds, the API was unable to receive a successful response.`
    );
    return null;
  } else {
    console.log(`${caller} | status: ${status} | unknown error`);
    return null;
  }
}

interface GetDomProps {
  url: string;
  autoParse?: boolean;
  country?: ScraperApiCountry;
  useResidentialProxies?: boolean;
  followRedirect?: boolean;
  enableJavascript?: boolean;
  enableBypassMechanisms?: boolean;
}

export async function getDom({
  url,
  autoParse = false,
  country = "us",
  useResidentialProxies = false,
  followRedirect = false,
  enableJavascript = false,
  enableBypassMechanisms = false,
}: GetDomProps): Promise<ScraperApiResponse<Document | null>> {
  const reqParamsObj = {
    api_key: scraperApiApiKey,
    url,
    autoparse: autoParse.toString(),
    binary_target: "false",
    country_code: country,
    device_type: "desktop",
    follow_redirect: followRedirect.toString(),
    premium: useResidentialProxies.toString(),
    render: enableJavascript.toString(),
    retry_404: "false",
    ultra_premium: enableBypassMechanisms.toString(),
  };

  const params = new URLSearchParams(reqParamsObj);
  const requestUrl = `http://api.scraperapi.com?${params.toString()}`;

  try {
    const { status, data } = await axiosScraperApiInstance.get<string>(
      requestUrl,
      { headers: { "Content-Type": "application/json" } }
    );
    return handleFinalResponse<Document>({
      loggingProps: {
        fileName: "getDom",
        directory: "scraperApi",
        fileType: ".html",
        loggingData: data,
      },
      caller: `getDom() ${url}`,
      status,
      data: new jsdom.JSDOM(data).window.document,
    });
  } catch (err) {
    const axiosError = err as AxiosError;
    console.log("Error getDom", axiosError.message);
    return handleFinalResponse<null>({
      loggingProps: null,
      caller: `getDom(${url})`,
      status: axiosError.response?.status ?? null,
      data: null,
    });
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function formatAutoParsedJson<T>(json: any): T {
  const formattedJson: any = {};
  for (const [key, value] of Object.entries(json)) {
    const formattedKey = key.toLowerCase().replace(/ /g, "_");
    if (value && typeof value === "object" && !Array.isArray(value)) {
      formattedJson[formattedKey] = formatAutoParsedJson(value);
    } else if (typeof value === "string") {
      //removes non-ascii characters
      if (formattedKey !== "product_category")
        formattedJson[formattedKey] = value.replace(/[^\x20-\x7E]/g, "");
      else formattedJson[formattedKey] = value;
    } else {
      formattedJson[formattedKey] = value;
    }
  }

  return formattedJson as T;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line @typescript-eslint/ban-types
export async function getDomAutoParse<T = Object>({
  url,
  autoParse = true,
  country = "us",
  useResidentialProxies = false,
  followRedirect = false,
  enableJavascript = false,
  enableBypassMechanisms = false,
}: GetDomProps): Promise<ScraperApiResponse<T | null>> {
  const reqParamsObj = {
    api_key: scraperApiApiKey,
    url,
    autoparse: autoParse.toString(),
    binary_target: "false",
    country_code: country,
    device_type: "desktop",
    follow_redirect: followRedirect.toString(),
    premium: useResidentialProxies.toString(),
    render: enableJavascript.toString(),
    retry_404: "false",
    ultra_premium: enableBypassMechanisms.toString(),
  };

  const params = new URLSearchParams(reqParamsObj);
  const requestUrl = `http://api.scraperapi.com?${params.toString()}`;

  try {
    const { status, data } = await axiosScraperApiInstance.get<T>(requestUrl, {
      headers: { "Content-Type": "application/json" },
    });
    return handleFinalResponse<T>({
      loggingProps: {
        fileName: "getDom",
        directory: "scraperApi",
        fileType: ".json",
        loggingData: JSON.stringify(data),
      },
      caller: `getDom() ${url}`,
      status,
      data: formatAutoParsedJson<T>(data),
    });
  } catch (err) {
    const axiosError = err as AxiosError;
    console.log("Error getDomAutoParse", axiosError.message);
    return handleFinalResponse<null>({
      loggingProps: null,
      caller: `getDom(${url})`,
      status: axiosError.response?.status ?? null,
      data: null,
    });
  }
}
