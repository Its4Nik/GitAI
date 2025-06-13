import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ProviderConfig } from "./ai/providers/types";
import { write, file } from "bun";

const CONFIG_PATH = join(
  process.env.HOME || process.env.USERPROFILE || "",
  ".ai-commit.json"
);

export interface Config {
  defaultProvider: string;
  defaultModel: string;
  providers: Record<string, ProviderConfig>;
  templates: {
    commit: string;
  };
}

export async function loadConfig(): Promise<Config> {
  if (!existsSync(CONFIG_PATH)) {
    return {
      defaultProvider: "gemini",
      defaultModel: "",
      providers: {},
      templates: {
        commit: "conventional",
      },
    };
  }

  const configFile = file(CONFIG_PATH);
  const configText = await configFile.text();
  return JSON.parse(configText);
}

export async function saveConfig(config: Config) {
  await write(CONFIG_PATH, JSON.stringify(config, null, 2));
}
