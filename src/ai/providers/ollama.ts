import type { AIProvider, ProviderConfig } from "./types";

export const OllamaProvider: AIProvider = {
	generate: async (prompt, config: ProviderConfig = {}) => {
		const baseUrl = config.baseUrl || "http://localhost:11434";
		const model = config.model || "llama3";

		const response = await fetch(`${baseUrl}/api/generate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model,
				prompt,
				stream: false,
			}),
		});

		if (!response.ok) {
			throw new Error(`Ollama API error: ${response.statusText}`);
		}

		const data = await response.json();
		return data.response.trim();
	},
	models: ["llama3", "mistral", "codellama"],
};
