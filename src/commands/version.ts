import type { Command } from "commander";
import { getProvider } from "../ai/providers";
import { loadConfig } from "../config";
import { generateVersionPrompt } from "../prompts/commits";
import { SEMVER_CATEGORIES } from "../prompts/templates";
import { getRecentCommits } from "../utils/git";

export async function versionCommand() {
  try {
    const config = await loadConfig();
    const provider = getProvider(config.defaultProvider);

    // Get recent commits
    const commits = getRecentCommits();
    if (commits.length === 0) {
      console.log("No commits found since last tag");
      return;
    }

    // Generate version prompt
    const prompt = generateVersionPrompt(commits);
    const suggestion = await provider.generate(prompt, {
      model: config.defaultModel,
      ...config.providers?.[config.defaultProvider],
    });

    // Parse and validate suggestion
    const cleanSuggestion = suggestion.trim().toLowerCase();
    const validSuggestions = Object.keys(SEMVER_CATEGORIES);

    if (!validSuggestions.includes(cleanSuggestion)) {
      console.log(`❌ Invalid version suggestion: ${suggestion}`);
      console.log(`Valid options are: ${validSuggestions.join(", ")}`);
      return;
    }

    console.log(`Suggested version bump: ${cleanSuggestion}`);
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

export function versionCommandSetup(program: Command) {
  program
    .command("version")
    .description("Suggest semantic version upgrade based on commit history")
    .action(versionCommand);
}
