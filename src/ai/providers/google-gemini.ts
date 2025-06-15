import { GoogleGenerativeAI } from "@google/generative-ai";
import { DebugLogger } from "../../utils/logger";
import type { AIProvider, ProviderConfig } from "./types";

export const GoogleGeminiProvider: AIProvider = {
	generate: async (prompt, config: ProviderConfig = {}) => {
		const logger = DebugLogger.getInstance();
		const startTime = Date.now();

		const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
		if (!apiKey) {
			throw new Error(
				"Gemini API key is required. Set it in the configuration or as GEMINI_API_KEY environment variable.",
			);
		}

		try {
			const genAI = new GoogleGenerativeAI(apiKey);
			const modelName = config.model || "gemini-1.5-flash";
			const model = genAI.getGenerativeModel({ model: modelName });

			const result = await model.generateContent(prompt);
			const response = result.response.text();

			if (logger.isEnabled()) {
				logger.log({
					command: process.argv[2] || "unknown",
					provider: "gemini",
					model: modelName,
					promptLength: prompt.length,
					responseLength: response.length,
					duration: Date.now() - startTime,
					request: {
						model: modelName,
						prompt:
							prompt.substring(0, 200) + (prompt.length > 200 ? "..." : ""),
					},
					response: {
						text:
							response.substring(0, 200) + (response.length > 200 ? "..." : ""),
					},
				});
			}

			return response;
		} catch (error) {
			if (logger.isEnabled()) {
				logger.log({
					command: process.argv[2] || "unknown",
					provider: "gemini",
					model: config.model || "gemini-1.5-flash",
					promptLength: prompt.length,
					responseLength: 0,
					duration: Date.now() - startTime,
					request: {
						model: config.model || "gemini-1.5-flash",
						prompt:
							prompt.substring(0, 200) + (prompt.length > 200 ? "..." : ""),
					},
					response: {
						error: error instanceof Error ? error.message : "Unknown error",
					},
				});
			}

			throw new Error(
				`Gemini API error: ${error instanceof Error ? error.message : error}`,
			);
		}
	},
	models: [
		"gemini-pro",
		"gemini-1.5-flash",
		"gemini-2.0-flash",
		"gemini-2.0-flash-lite",
	],
};
