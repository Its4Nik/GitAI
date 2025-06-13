import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { cwd } from "node:process";
import { file, write } from "bun";
import ignore from "ignore";
import type { ProviderConfig } from "./ai/providers/types";

const USER_CONFIG_PATH = join(homedir(), "gitai.json");
const PROJECT_CONFIG_PATH = join(cwd(), ".gitai.json");

export interface Config {
	defaultProvider: string;
	defaultModel: string;
	maxCommits?: number;
	providers: Record<string, ProviderConfig>;
	templates: {
		commit: string;
	};
}

export async function loadConfig(): Promise<Config> {
	let configPath = USER_CONFIG_PATH;
	let isProjectConfig = false;

	// Check if project config exists and is preferred
	if (existsSync(PROJECT_CONFIG_PATH) && process.env.GITAI_CONFIG !== "user") {
		configPath = PROJECT_CONFIG_PATH;
		isProjectConfig = true;
	}

	if (!existsSync(configPath)) {
		return getDefaultConfig();
	}

	const configFile = file(configPath);
	const config: Config = await configFile.json();

	// Migrate old config format
	if (!config.templates?.commit) {
		config.templates = config.templates || { commit: "conventional" };
	}

	// Set default model if not present
	if (!config.defaultModel) {
		const providerModel = config.providers[config.defaultProvider]?.model;
		if (providerModel) {
			config.defaultModel = providerModel;
		} else {
			config.defaultModel = getDefaultConfig().defaultModel;
		}
	}

	// Check if project config is ignored
	if (isProjectConfig) {
		const isIgnored = isConfigIgnored();
		if (!isIgnored) {
			console.warn(
				"⚠️  Warning: .gitai.json is not ignored by your ignore files",
			);
		}
	}

	return config;
}

export async function saveConfig(config: Config, location: "user" | "project") {
	const configPath =
		location === "project" ? PROJECT_CONFIG_PATH : USER_CONFIG_PATH;
	await write(configPath, JSON.stringify(config, null, 2));
}

export function getDefaultConfig(): Config {
	return {
		defaultProvider: "gemini",
		defaultModel: "gemini-1.5-flash",
		maxCommits: 10,
		providers: {
			gemini: { model: "gemini-1.5-flash", apiKey: "" },
			ollama: { model: "codellama", baseUrl: "http://localhost:11434" },
		},
		templates: {
			commit: "conventional",
		},
	};
}

export function isConfigIgnored(): boolean {
	const ig = ignore();

	// Add common ignore files
	const ignoreFiles = [
		".gitignore",
		".dockerignore",
		".eslintignore",
		".prettierignore",
		".aiignore",
	];

	for (const ignoreFile of ignoreFiles) {
		const ignorePath = join(cwd(), ignoreFile);
		if (existsSync(ignorePath)) {
			try {
				const text = readFileSync(ignorePath, "utf-8");
				ig.add(text);
			} catch (error) {
				console.warn(
					`⚠️  Could not read ${ignoreFile}: ${
						error instanceof Error ? error.message : error
					}`,
				);
			}
		}
	}

	// Add default ignores
	ig.add([".git", ".DS_Store", "node_modules", "dist", "build"]);

	// Explicitly check if .gitai.json is ignored
	return ig.ignores(".gitai.json");
}

export function getIgnoreFilter() {
	const ig = ignore();

	// Add common ignore files
	const ignoreFiles = [
		".gitignore",
		".dockerignore",
		".eslintignore",
		".prettierignore",
		".aiignore",
	];

	for (const ignoreFile of ignoreFiles) {
		const ignorePath = join(cwd(), ignoreFile);
		if (existsSync(ignorePath)) {
			try {
				const text = readFileSync(ignorePath, "utf-8");
				ig.add(text);
			} catch (error) {
				console.warn(
					`⚠️  Could not read ${ignoreFile}: ${
						error instanceof Error ? error.message : error
					}`,
				);
			}
		}
	}

	// Add default ignores
	ig.add([".git", ".DS_Store", "node_modules", "dist", "build"]);

	return ig;
}
