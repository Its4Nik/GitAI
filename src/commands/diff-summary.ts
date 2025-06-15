import type { Command } from "commander";
import { getProvider } from "../ai/providers";
import { loadConfig } from "../config";
import { getDiffBetweenRefs } from "../utils/git";
import { stripMarkdownFences } from "../utils/string";

export async function diffSummaryCommand(
	ref1: string,
	ref2?: string,
	options?: { markdown?: boolean },
) {
	try {
		const config = await loadConfig();
		const provider = getProvider(config.defaultProvider);

		// Handle single argument (compare HEAD to specified ref)
		const fromRef = ref2 ? ref1 : "HEAD";
		const toRef = ref2 || ref1;

		const diff = await getDiffBetweenRefs(fromRef, toRef);
		if (!diff) {
			console.log("No differences found");
			return;
		}

		const prompt = generateDiffPrompt(diff, fromRef, toRef);

		const summary = await provider.generate(prompt, {
			model: config.defaultModel,
			...config.providers?.[config.defaultProvider],
		});

		const cleanedSummary = stripMarkdownFences(summary).trim();

		if (options?.markdown) {
			console.log(`## Diff Summary: ${fromRef} → ${toRef}\n`);
			console.log(cleanedSummary);
		} else {
			console.log(`Diff Summary (${fromRef} → ${toRef}):\n`);
			console.log(cleanedSummary);
		}
	} catch (error) {
		console.error("❌ Error:", error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

function generateDiffPrompt(
	diff: string,
	fromRef: string,
	toRef: string,
): string {
	return `Summarize the key differences between these two references in a software development context:

References:
- From: ${fromRef}
- To: ${toRef}

Diff Output:
${diff}

Provide a concise summary focusing on:
1. Major changes and additions
2. Removed features or code
3. Notable refactors or improvements
4. Potential impact on functionality

Your Output format:

Format the summary in paragraph form. Do not include code blocks.

Short listing of changes.

Really short summary if there have been breaking changes.

`;
}

export function diffSummaryCommandSetup(program: Command) {
	program
		.command("diff-summary <from-ref> [to-ref]")
		.description(
			"Generate AI summary of differences between commits or branches",
		)
		.option("--markdown", "Output summary in markdown format")
		.action((fromRef, toRef, options) =>
			diffSummaryCommand(fromRef, toRef, options),
		);
}
