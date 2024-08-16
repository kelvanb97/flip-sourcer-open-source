import { AxiosError } from "axios";
import { Configuration, OpenAIApi } from "openai";
import { openAiApiKey } from "./envVars";

const config = new Configuration({ apiKey: openAiApiKey });
const openai = new OpenAIApi(config);

export async function gpt_3_5_turbo(
  content: string,
  max_tokens: number = 1
): Promise<{ status: number; content: string | null }> {
  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens,
      messages: [{ role: "user", content }],
    });

    return {
      status: chatCompletion.status,
      content: chatCompletion.data.choices[0].message?.content || null,
    };
  } catch (err) {
    const axiosError = err as AxiosError;

    const status = axiosError.response?.status;

    return { status: status ?? 500, content: "gpt_3_5_turbo error" };
  }
}
