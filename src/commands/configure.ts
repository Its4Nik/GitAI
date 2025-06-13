import { existsSync } from "node:fs";
import { join } from "node:path";
import inquirer from "inquirer";
import { PROVIDERS } from "../ai/providers";
import {
	getDefaultConfig,
	isConfigIgnored,
	loadConfig,
	saveConfig,
} from "../config";
import { COMMIT_TEMPLATES } from "../prompts/templates";

export async function configureCommand() {
	// Determine where to save config
	const { location } = await inquirer.prompt({
		type: "list",
		name: "location",
		message: "Where should we save the configuration?",
		choices: [
			{ name: "User-level (global)", value: "user" },
			{ name: "Project-level (current directory)", value: "project" },
		],
		default: existsSync(join(process.cwd(), ".gitai.json"))
			? "project"
			: "user",
	});

	// Check if project config would be ignored
	if (location === "project" && !isConfigIgnored()) {
		const { proceed } = await inquirer.prompt({
			type: "confirm",
			name: "proceed",
			message:
				"Warning: .gitai.json is not ignored by your ignore files. Save anyway?",
			default: false,
		});

		if (!proceed) {
			console.log("Configuration cancelled");
			return;
		}
	}

	const config = await loadConfig();

	// Select default AI provider
	const { provider } = await inquirer.prompt({
		type: "list",
		name: "provider",
		message: "Select default AI provider:",
		choices: Object.keys(PROVIDERS),
		default: config.defaultProvider,
	});
	config.defaultProvider = provider;

	// Configure each provider
	for (const [name, providerImpl] of Object.entries(PROVIDERS)) {
		const providerConfig =
			config.providers[name] || getDefaultConfig().providers[name] || {};
		const defaultModel = providerImpl.models?.[0] || "";

		if (providerImpl.models) {
			const { model } = await inquirer.prompt({
				type: "list",
				name: "model",
				message: `Default model for ${name}:`,
				choices: providerImpl.models,
				default: providerConfig.model || defaultModel,
			});
			providerConfig.model = model;
		}

		if (name === "gemini") {
			const { apiKey } = await inquirer.prompt({
				type: "password",
				name: "apiKey",
				message: "Enter Gemini API key:",
				default: providerConfig.apiKey || process.env.GEMINI_API_KEY || "",
			});
			providerConfig.apiKey = apiKey;
		}

		if (name === "openai") {
			const { apiKey } = await inquirer.prompt({
				type: "password",
				name: "apiKey",
				message: "Enter OpenAI API key:",
				default: providerConfig.apiKey || process.env.OPENAI_API_KEY || "",
			});
			providerConfig.apiKey = apiKey;
		}

		if (name === "ollama") {
			const { baseUrl } = await inquirer.prompt({
				type: "input",
				name: "baseUrl",
				message: "Enter Ollama base URL:",
				default: providerConfig.baseUrl || "http://localhost:11434",
			});
			providerConfig.baseUrl = baseUrl;
		}

		config.providers[name] = providerConfig;
	}

	// Set default model to match the provider's model
	const providerModel = config.providers[config.defaultProvider]?.model;
	if (providerModel) {
		config.defaultModel = providerModel;
	} else {
		// Fallback to default model if not set
		config.defaultModel = getDefaultConfig().defaultModel;
	}

	// Configure commit template
	const { template } = await inquirer.prompt({
		type: "list",
		name: "template",
		message: "Select default commit template:",
		choices: Object.keys(COMMIT_TEMPLATES),
		default: config.templates?.commit || "conventional",
	});
	config.templates = config.templates || { commit: "conventional" };
	config.templates.commit = template;

	// Configure max commits for version/changelog
	const { maxCommits } = await inquirer.prompt({
		type: "number",
		name: "maxCommits",
		message: "Max commits to analyze for version/changelog:",
		default: config.maxCommits || 10,
		validate: (input) => (input || 0) > 0 || "Must be at least 1",
	});
	config.maxCommits = maxCommits;

	await saveConfig(config, location);
	console.log(
		`✅ Configuration saved to ${
			location === "project" ? "project" : "user"
		} config!`,
	);
}
