import type { Command } from "commander";
import { getProvider } from "../ai/providers";
import { loadConfig } from "../config";
import { generateVersionPrompt } from "../prompts/commit";
import { SEMVER_CATEGORIES } from "../prompts/templates";
import { getRecentCommits } from "../utils/git";
import { stripMarkdownFences } from "../utils/string";

export async function versionCommand() {
	try {
		const config = await loadConfig();
		const provider = getProvider(config.defaultProvider);

		// Get recent commits using configured max
		const commits = getRecentCommits(config.maxCommits || 10);
		if (commits.length === 0) {
			console.log("No commits found since last tag");
			return;
		}

		// Generate version prompt with commit subjects
		const commitSubjects = commits.map((c) => c.subject);
		const prompt = generateVersionPrompt(commitSubjects);

		let suggestion = await provider.generate(prompt, {
			model: config.defaultModel,
			...config.providers?.[config.defaultProvider],
		});

		// Clean the suggestion
		suggestion = stripMarkdownFences(suggestion).trim().toLowerCase();

		// Parse and validate suggestion
		const validSuggestions = Object.keys(SEMVER_CATEGORIES);

		if (!validSuggestions.includes(suggestion)) {
			console.log(`❌ Invalid version suggestion: ${suggestion}`);
			console.log(`Valid options are: ${validSuggestions.join(", ")}`);
			return;
		}

		console.log(`Suggested version bump: ${suggestion}`);
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
