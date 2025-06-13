import { write } from "bun";
import type { Command } from "commander";
import { getProvider } from "../ai/providers";
import { loadConfig } from "../config";
import { generateChangelogPrompt } from "../prompts/commit";
import { type GitCommit, getRecentCommits } from "../utils/git";
import { stripMarkdownFences } from "../utils/string";

function formatCommitForChangelog(commit: GitCommit): string {
	return `Commit: ${commit.hash}\nAuthor: ${commit.author}\nDate: ${commit.date}\n\n${commit.subject}\n\n${commit.body}`;
}

export async function changelogCommand(options: { output?: string }) {
	try {
		const config = await loadConfig();
		const provider = getProvider(config.defaultProvider);

		// Get recent commits using configured max
		const commits = getRecentCommits(config.maxCommits || 10);
		if (commits.length === 0) {
			console.log("No commits found since last tag");
			return;
		}

		// Generate changelog prompt with commit details
		const formattedCommits = commits.map(formatCommitForChangelog);
		const prompt = generateChangelogPrompt(formattedCommits);

		const changelog = await provider.generate(prompt, {
			model: config.defaultModel,
			...config.providers?.[config.defaultProvider],
		});

		// Clean and process the generated changelog
		const cleanedChangelog = stripMarkdownFences(changelog).trim();

		// Write to file or console
		if (options.output) {
			await write(options.output, cleanedChangelog);
			console.log(`✅ Changelog written to ${options.output}`);
		} else {
			console.log("\nGenerated changelog:\n");
			console.log(cleanedChangelog);
		}
	} catch (error) {
		console.error("❌ Error:", error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function changelogCommandSetup(program: Command) {
	program
		.command("changelog")
		.description("Generate changelog using AI")
		.option("-o, --output <file>", "Output file (default: print to console)")
		.action(changelogCommand);
}
