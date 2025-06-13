import { write } from "bun";
import type { Command } from "commander";
import { getProvider } from "../ai/providers";
import { loadConfig } from "../config";
import { generateChangelogPrompt } from "../prompts/commits";
import { getRecentCommits } from "../utils/git";

export async function changelogCommand(options: { output?: string }) {
  try {
    const config = await loadConfig();
    const provider = getProvider(config.defaultProvider);

    // Get recent commits
    const commits = getRecentCommits();
    if (commits.length === 0) {
      console.log("No commits found since last tag");
      return;
    }

    // Generate changelog prompt
    const prompt = generateChangelogPrompt(commits);
    const changelog = await provider.generate(prompt, {
      model: config.defaultModel,
      ...config.providers?.[config.defaultProvider],
    });

    // Write to file or console
    if (options.output) {
      const outputPath = options.output;
      await write(outputPath, changelog);
      console.log(`✅ Changelog written to ${options.output}`);
    } else {
      console.log("\nGenerated changelog:\n");
      console.log(changelog);
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
