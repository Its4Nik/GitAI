import inquirer from "inquirer";
import { PROVIDERS } from "../ai/providers";
import { loadConfig, saveConfig } from "../config";

export async function configureCommand() {
  const config = await loadConfig();

  const { provider } = await inquirer.prompt({
    type: "list",
    name: "provider",
    message: "Select default AI provider:",
    choices: Object.keys(PROVIDERS),
    default: config.defaultProvider,
  });

  config.defaultProvider = provider;

  for (const [name, provider] of Object.entries(PROVIDERS)) {
    const providerConfig = config.providers[name] || {};

    if (provider.models) {
      const { model } = await inquirer.prompt({
        type: "list",
        name: "model",
        message: `Default model for ${name}:`,
        choices: provider.models,
        default: providerConfig.model || provider.models[0],
      });
      providerConfig.model = model;
    }

    if (name === "gemini") {
      const { apiKey } = await inquirer.prompt({
        type: "password",
        name: "apiKey",
        message: "Enter Gemini API key:",
        default: providerConfig.apiKey || process.env.GEMINI_API_KEY,
      });
      providerConfig.apiKey = apiKey;
    }

    config.providers[name] = providerConfig;
  }

  saveConfig(config);
  console.log("Configuration saved!");
}
