import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
}

export const getChatGPTResponse = async (
  prompt: string
): Promise<AIResponse> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-5.2-2025-12-11",
    });

    const content = completion.choices[0].message.content || "";
    console.log(content);

    return {
      success: true,
      content,
    };
  } catch (error: any) {
    console.error("OpenAI API Error:", error.message);
    return {
      success: false,
      content: "",
      error: error.message,
    };
  }
};
