import {
  Box,
  chakra,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  SimpleGrid,
  Spinner,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { GeneralSettings } from "../../../../types/User";
import Card from "../../../components/shared/Card";
import Loader from "../../../components/shared/Loader";
import { DarkModeContext } from "../../../providers/DarkModeProvider";
import { InputField } from "../../../components/shared/Fields";
import Button from "../../../components/shared/Button";
import { MdInfoOutline } from "react-icons/md";
import { apiCall } from "../../../utils/apiCall";
import { genericToastError } from "../../../utils/constants";
import mixpanelAnalytics from "../../../utils/analytics/mixpanelAnalytics";
import googleAnalytics from "../../../utils/analytics/googleAnalytics";
import { UserContext } from "../../../providers/UserProvider";
import facebookAnalytics from "../../../utils/analytics/facebookAnalytics";

function stringGeneralSettingsToGeneralSettings(
  stringGeneralSettings: StringGeneralSettings
): GeneralSettings {
  return {
    defaultFbaFee: parseFloat(stringGeneralSettings.defaultFbaFee),
    perUnitCosts: {
      flat: parseFloat(stringGeneralSettings.perUnitCosts.flat),
      percent: parseFloat(stringGeneralSettings.perUnitCosts.percent),
    },
    shippingCosts: {
      perPound: parseFloat(stringGeneralSettings.shippingCosts.perPound),
      perOunce: parseFloat(stringGeneralSettings.shippingCosts.perOunce),
      perKilogram: parseFloat(stringGeneralSettings.shippingCosts.perKilogram),
      perGram: parseFloat(stringGeneralSettings.shippingCosts.perGram),
      perUnit: parseFloat(stringGeneralSettings.shippingCosts.perUnit),
    },
    cashback: {
      flat: parseFloat(stringGeneralSettings.cashback.flat),
      percent: parseFloat(stringGeneralSettings.cashback.percent),
    },
    measurementSystem: stringGeneralSettings.measurementSystem as
      | "imperial"
      | "metric",
  };
}

function generalSettingsToStringGeneralSettings(
  generalSettings: GeneralSettings
): StringGeneralSettings {
  return {
    defaultFbaFee: generalSettings.defaultFbaFee.toString(),
    perUnitCosts: {
      flat: generalSettings.perUnitCosts.flat.toString(),
      percent: generalSettings.perUnitCosts.percent.toString(),
    },
    shippingCosts: {
      perPound: generalSettings.shippingCosts.perPound.toString(),
      perOunce: generalSettings.shippingCosts.perOunce.toString(),
      perKilogram: generalSettings.shippingCosts.perKilogram.toString(),
      perGram: generalSettings.shippingCosts.perGram.toString(),
      perUnit: generalSettings.shippingCosts.perUnit.toString(),
    },
    cashback: {
      flat: generalSettings.cashback.flat.toString(),
      percent: generalSettings.cashback.percent.toString(),
    },
    measurementSystem: generalSettings.measurementSystem,
  };
}

function isValidNumber(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDeepValue(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setDeepValue(obj: any, path: string, value: any) {
  path.split(".").reduce((acc, part, index, array) => {
    if (index === array.length - 1) {
      acc[part] = value;
    }
    return acc && acc[part];
  }, obj);
}

const defaultGeneralSettings: GeneralSettings = {
  defaultFbaFee: 3.39,
  perUnitCosts: {
    flat: 0,
    percent: 0,
  },
  shippingCosts: {
    perPound: 0,
    perOunce: 0,
    perKilogram: 0,
    perGram: 0,
    perUnit: 0,
  },
  cashback: {
    flat: 0,
    percent: 0,
  },
  measurementSystem: "imperial",
};

type Stringified<T> = {
  [K in keyof T]: T[K] extends object ? Stringified<T[K]> : string;
};

type StringGeneralSettings = Stringified<GeneralSettings>;

const defaultStringGeneralSettings: StringGeneralSettings =
  generalSettingsToStringGeneralSettings(defaultGeneralSettings);

export default function SettingsGeneral() {
  const { darkModeColor } = useContext(DarkModeContext);
  const toast = useToast();
  const { user } = useContext(UserContext);
  const [strGeneralSettings, setStrGeneralSettings] =
    useState<StringGeneralSettings>(defaultStringGeneralSettings);
  const [saving, setSaving] = useState(false);

  // Update the handleInputChange and handleInputBlur functions to use these helpers:

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
    path: string
  ) {
    const { value } = event.target;

    setStrGeneralSettings((prevSettings) => {
      const clonedSettings = { ...prevSettings };
      setDeepValue(clonedSettings, path, value);
      return clonedSettings;
    });
  }

  function handleInputBlur(
    event: React.ChangeEvent<HTMLInputElement>,
    path: string,
    conversions: Record<string, (value: number) => number> = {}
  ) {
    const { value } = event.target;

    if (!isValidNumber(value)) {
      errorToast(`Invalid value for ${path.split(".").join(" > ")}`);
      setStrGeneralSettings((prevSettings) => {
        const clonedSettings = { ...prevSettings };
        setDeepValue(
          clonedSettings,
          path,
          getDeepValue(defaultStringGeneralSettings, path)
        );
        return clonedSettings;
      });
    } else {
      const floatValue = parseFloat(value);
      setStrGeneralSettings((prevSettings) => {
        const clonedSettings = { ...prevSettings };
        setDeepValue(clonedSettings, path, floatValue);
        for (const conversionPath in conversions) {
          setDeepValue(
            clonedSettings,
            conversionPath,
            conversions[conversionPath](floatValue)
          );
        }
        return clonedSettings;
      });
    }
  }

  useEffect(() => {
    if (user)
      setStrGeneralSettings(
        generalSettingsToStringGeneralSettings(user.generalSettings)
      );
  }, [user]);

  function errorToast(errMsg: string) {
    toast({
      title: errMsg,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  async function handleSavePreFlight(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    await handleSave(e);
    setSaving(false);
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const generalSettings =
      stringGeneralSettingsToGeneralSettings(strGeneralSettings);

    if (
      generalSettings.defaultFbaFee < 0 ||
      isNaN(generalSettings.defaultFbaFee)
    )
      return errorToast("Default FBA must be greater than or equal to 0.");

    if (
      generalSettings.perUnitCosts.flat < 0 ||
      isNaN(generalSettings.perUnitCosts.flat)
    )
      return errorToast(
        "Per unit costs flat must be greater than or equal to 0."
      );

    if (
      generalSettings.perUnitCosts.percent < 0 ||
      isNaN(generalSettings.perUnitCosts.percent)
    )
      return errorToast(
        "Per unit costs percent must be greater than or equal to 0."
      );

    if (generalSettings.measurementSystem === "imperial") {
      if (
        generalSettings.shippingCosts.perPound < 0 ||
        isNaN(generalSettings.shippingCosts.perPound)
      )
        return errorToast(
          "Shipping costs per pound must be greater than or equal to 0."
        );

      if (
        generalSettings.shippingCosts.perOunce < 0 ||
        isNaN(generalSettings.shippingCosts.perOunce)
      )
        return errorToast(
          "Shipping costs per ounce must be greater than or equal to 0."
        );
    } else if (generalSettings.measurementSystem === "metric") {
      if (
        generalSettings.shippingCosts.perKilogram < 0 ||
        isNaN(generalSettings.shippingCosts.perKilogram)
      )
        return errorToast(
          "Shipping costs per kilogram must be greater than or equal to 0."
        );

      if (
        generalSettings.shippingCosts.perGram < 0 ||
        isNaN(generalSettings.shippingCosts.perGram)
      )
        return errorToast(
          "Shipping costs per gram must be greater than or equal to 0."
        );
    } else {
      return errorToast("Measurement system must be imperial or metric.");
    }

    if (
      generalSettings.shippingCosts.perUnit < 0 ||
      isNaN(generalSettings.shippingCosts.perUnit)
    )
      return errorToast(
        "Shipping costs per unit must be greater than or equal to 0."
      );

    if (
      generalSettings.cashback.flat < 0 ||
      isNaN(generalSettings.cashback.flat)
    )
      return errorToast("Cashback flat must be greater than or equal to 0.");

    if (
      generalSettings.cashback.percent < 0 ||
      isNaN(generalSettings.cashback.percent)
    )
      return errorToast("Cashback percent must be greater than or equal to 0.");

    const res = await apiCall("/user/general-settings", {
      method: "PUT",
      body: generalSettings,
      isSessionRequest: true,
    });

    if (!res) return toast(genericToastError);
    else if (res.status !== 200) return errorToast(res.message);

    mixpanelAnalytics.trackEvent("General Settings: Save");
    googleAnalytics.trackEvent("User", "General Settings: Save");
    facebookAnalytics.trackEvent("General Settings: Save");
    toast({
      title: "General Settings saved.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <>
      {user ? (
        <Flex direction="column" rowGap={3} maxW="max-content">
          <Heading as="h3" size="lg" color={darkModeColor}>
            General Settings
          </Heading>
          <Card maxW={"600px"}>
            <form
              onSubmit={async (e) => {
                await handleSavePreFlight(e);
              }}
            >
              <Flex flexDir="column" rowGap={5}>
                <Box>
                  These settings are used to calculate the profit of your
                  products. You can change them to fit how your business
                  operates.
                </Box>
                <InputField
                  type="number"
                  label="Default FBA fee"
                  value={strGeneralSettings.defaultFbaFee}
                  onChange={(e) => handleInputChange(e, "defaultFbaFee")}
                  onBlur={(e) => handleInputBlur(e, "defaultFbaFee")}
                  tooltip="This is the default FBA fee that will be used if Amazon does not tell us what their fee is."
                  inputLeftAddon="$"
                />
                <Box>
                  <Flex fontSize={"xl"} fontWeight="bold">
                    <Box mr={1}>Per unit costs</Box>
                    <Tooltip
                      label={
                        "If your business has fees related to each unit of inventory you have. For example prep centers charge a fee per unit."
                      }
                      hasArrow
                      placement="top-start"
                      shadow={"dark-lg"}
                    >
                      <chakra.span my="auto">
                        <MdInfoOutline
                          cursor="pointer"
                          color="dodgerblue"
                          size="18px"
                        />
                      </chakra.span>
                    </Tooltip>
                  </Flex>
                  <Flex columnGap={3}>
                    <InputField
                      type="text"
                      label="Flat"
                      value={strGeneralSettings.perUnitCosts.flat}
                      onChange={(e) =>
                        handleInputChange(e, "perUnitCosts.flat")
                      }
                      onBlur={(e) => handleInputBlur(e, "perUnitCosts.flat")}
                      inputLeftAddon="$"
                    />
                    <InputField
                      type="text"
                      label="Percent"
                      tooltip="Cost calculated based on the sale price of the product."
                      value={strGeneralSettings.perUnitCosts.percent}
                      onChange={(e) =>
                        handleInputChange(e, "perUnitCosts.percent")
                      }
                      onBlur={(e) => handleInputBlur(e, "perUnitCosts.percent")}
                      inputLeftAddon="%"
                    />
                  </Flex>
                </Box>
                <Box>
                  <Flex fontSize={"xl"} fontWeight="bold">
                    <Box mr={1}>Shipping costs</Box>
                    <Tooltip
                      label={
                        "Shipping costs associated with each unit of inventory."
                      }
                      hasArrow
                      placement="top-start"
                      shadow={"dark-lg"}
                    >
                      <chakra.span my="auto">
                        <MdInfoOutline
                          cursor="pointer"
                          color="dodgerblue"
                          size="18px"
                        />
                      </chakra.span>
                    </Tooltip>
                  </Flex>
                  <SimpleGrid columns={[1, 1, 2]} columnGap={3} rowGap={3}>
                    {strGeneralSettings.measurementSystem === "imperial" && (
                      <>
                        <InputField
                          type="number"
                          label="Per pound"
                          value={strGeneralSettings.shippingCosts.perPound}
                          onChange={(e) =>
                            handleInputChange(e, "shippingCosts.perPound")
                          }
                          onBlur={(e) =>
                            handleInputBlur(e, "shippingCosts.perPound", {
                              "shippingCosts.perOunce": (v) => v / 16,
                              "shippingCosts.perKilogram": (v) => v * 2.20462,
                              "shippingCosts.perGram": (v) =>
                                (v * 2.20462) / 1000,
                            })
                          }
                          inputLeftAddon="$"
                          inputRightAddon="/lbs"
                        />
                        <InputField
                          type="number"
                          label="Per ounce"
                          value={strGeneralSettings.shippingCosts.perOunce}
                          onChange={(e) =>
                            handleInputChange(e, "shippingCosts.perOunce")
                          }
                          onBlur={(e) =>
                            handleInputBlur(e, "shippingCosts.perOunce", {
                              "shippingCosts.perPound": (v) => v * 16,
                              "shippingCosts.perKilogram": (v) =>
                                v * 16 * 2.20462,
                              "shippingCosts.perGram": (v) =>
                                (v * 16 * 2.20462) / 1000,
                            })
                          }
                          inputLeftAddon="$"
                          inputRightAddon="/oz"
                        />
                      </>
                    )}
                    {strGeneralSettings.measurementSystem === "metric" && (
                      <>
                        <InputField
                          type="number"
                          label="Per kilogram"
                          value={strGeneralSettings.shippingCosts.perKilogram}
                          onChange={(e) =>
                            handleInputChange(e, "shippingCosts.perKilogram")
                          }
                          onBlur={(e) =>
                            handleInputBlur(e, "shippingCosts.perKilogram", {
                              "shippingCosts.perPound": (v) => v / 2.20462,
                              "shippingCosts.perOunce": (v) => v / 2.20462 / 16,
                              "shippingCosts.perGram": (v) => v / 1000,
                            })
                          }
                          inputLeftAddon="$"
                          inputRightAddon="/kg"
                        />
                        <InputField
                          type="number"
                          label="Per gram"
                          value={strGeneralSettings.shippingCosts.perGram}
                          onChange={(e) =>
                            handleInputChange(e, "shippingCosts.perGram")
                          }
                          onBlur={(e) =>
                            handleInputBlur(e, "shippingCosts.perGram", {
                              "shippingCosts.perPound": (v) =>
                                (v * 1000) / 2.20462,
                              "shippingCosts.perOunce": (v) =>
                                (v * 1000) / 2.20462 / 16,
                              "shippingCosts.perKilogram": (v) => v * 1000,
                            })
                          }
                          inputLeftAddon="$"
                          inputRightAddon="/g"
                        />
                      </>
                    )}
                    <InputField
                      type="number"
                      label="Per unit"
                      value={strGeneralSettings.shippingCosts.perUnit}
                      onChange={(e) =>
                        handleInputChange(e, "shippingCosts.perUnit")
                      }
                      onBlur={(e) =>
                        handleInputBlur(e, "shippingCosts.perUnit", {})
                      }
                      inputLeftAddon="$"
                      inputRightAddon="/unit"
                    />
                  </SimpleGrid>
                </Box>
                <Box>
                  <Flex fontSize={"xl"} fontWeight="bold">
                    <Box mr={1}>Cashback</Box>
                    <Tooltip
                      label={
                        "Viewed as a reduction to the purchase price of the product in question."
                      }
                      hasArrow
                      placement="top-start"
                      shadow={"dark-lg"}
                    >
                      <chakra.span my="auto">
                        <MdInfoOutline
                          cursor="pointer"
                          color="dodgerblue"
                          size="18px"
                        />
                      </chakra.span>
                    </Tooltip>
                  </Flex>
                  <Flex columnGap={3}>
                    <InputField
                      type="number"
                      label="Flat"
                      value={strGeneralSettings.cashback.flat}
                      onChange={(e) => handleInputChange(e, "cashback.flat")}
                      onBlur={(e) => handleInputBlur(e, "cashback.flat", {})}
                      inputLeftAddon="$"
                    />
                    <InputField
                      type="number"
                      label="Percent"
                      tooltip="Cost calculated based on the sale price of the product."
                      value={strGeneralSettings.cashback.percent}
                      onChange={(e) => handleInputChange(e, "cashback.percent")}
                      onBlur={(e) => handleInputBlur(e, "cashback.percent", {})}
                      inputLeftAddon="%"
                    />
                  </Flex>
                </Box>
                <Box>
                  <Flex fontSize={"xl"} fontWeight="bold">
                    <Box mr={1}>Measurement system</Box>
                    <Tooltip
                      label={
                        "This is the default FBA fee that will be used if Amazon doesn't provide one."
                      }
                      hasArrow
                      placement="top-start"
                      shadow={"dark-lg"}
                    >
                      <chakra.span my="auto">
                        <MdInfoOutline
                          cursor="pointer"
                          color="dodgerblue"
                          size="18px"
                        />
                      </chakra.span>
                    </Tooltip>
                  </Flex>
                  <RadioGroup value={strGeneralSettings.measurementSystem}>
                    <Flex direction="column">
                      <Radio
                        value="imperial"
                        checked={
                          strGeneralSettings.measurementSystem === "imperial"
                        }
                        onChange={(e) =>
                          setStrGeneralSettings({
                            ...strGeneralSettings,
                            measurementSystem: e.target.value as "imperial",
                          })
                        }
                      >
                        Imperial
                      </Radio>
                      <Radio
                        value="metric"
                        checked={
                          strGeneralSettings.measurementSystem === "metric"
                        }
                        onChange={(e) =>
                          setStrGeneralSettings({
                            ...strGeneralSettings,
                            measurementSystem: e.target.value as "metric",
                          })
                        }
                      >
                        Metric
                      </Radio>
                    </Flex>
                  </RadioGroup>
                </Box>
                <Flex
                  flexDir={"row-reverse"}
                  borderTop="1px"
                  borderColor="gray.300"
                  mx={-3}
                  px={3}
                  pt={3}
                >
                  <Button type="submit" shadow="none">
                    {saving && <Spinner size="sm" mr={3} />}
                    Save
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Card>
        </Flex>
      ) : (
        <Loader />
      )}
    </>
  );
}
