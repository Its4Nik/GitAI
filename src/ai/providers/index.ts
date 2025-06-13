import { GoogleGeminiProvider } from "./google-gemini";
import { OllamaProvider } from "./ollama";
import type { AIProvider } from "./types";

export const PROVIDERS: Record<string, AIProvider> = {
	gemini: GoogleGeminiProvider,
	ollama: OllamaProvider,
};

export function getProvider(name: string): AIProvider {
	const provider = PROVIDERS[name.toLowerCase()];
	if (!provider) throw new Error(`Unsupported provider: ${name}`);
	return provider;
}
