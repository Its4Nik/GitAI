import ollama from "ollama";
import type { AIProvider, ProviderConfig } from "./types";

export const OllamaProvider: AIProvider = {
	generate: async (prompt, config: ProviderConfig = {}) => {
		try {
			const response = await ollama.chat({
				model: config.model || "llama3",
				messages: [
					{
						role: "user",
						content: prompt,
					},
				],
				stream: false,
				options: {
					temperature: 0.2,
					...config,
				},
			});

			return response.message.content.trim();
		} catch (error) {
			throw new Error(
				`Ollama API error: ${error instanceof Error ? error.message : error}`,
			);
		}
	},
	models: ["llama3", "mistral", "codellama"],
};
