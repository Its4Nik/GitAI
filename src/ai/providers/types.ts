export interface AIProvider {
	generate: (
		prompt: string,
		params?: Record<string, unknown>,
	) => Promise<string>;
	models?: string[];
}

export interface ProviderConfig {
	apiKey?: string;
	baseUrl?: string;
	model?: string;
}
