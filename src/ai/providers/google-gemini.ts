import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider, ProviderConfig } from "./types";

export const GoogleGeminiProvider: AIProvider = {
  generate: async (prompt, config: ProviderConfig = {}) => {
    const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Gemini API key is required. Set it in the configuration or as GEMINI_API_KEY environment variable."
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: config.model || "gemini-pro",
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  },
  models: ["gemini-pro", "gemini-2.5-flash", "gemini-2.0-flash"],
};
