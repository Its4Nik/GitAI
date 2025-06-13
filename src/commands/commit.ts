import inquirer from "inquirer";
import { getProvider } from "../ai/providers";
import { loadConfig } from "../config";
import { generateCommitPrompt } from "../prompts/commit";
import { commitChanges, getStagedDiff } from "../utils/git";

interface CommitOptions {
	template?: string;
	model?: string;
}

export async function commitCommand(options: CommitOptions) {
	try {
		const diff = await getStagedDiff();
		const config = await loadConfig();

		const provider = getProvider(config.defaultProvider);
		const prompt = generateCommitPrompt(
			diff,
			options.template || config.templates?.commit,
		);

		const message = await provider.generate(prompt, {
			model: options.model || config.defaultModel,
			...config.providers?.[config.defaultProvider],
		});

		console.log("\nGenerated commit message:\n");
		console.log(message);

		const { confirm } = await inquirer.prompt({
			type: "confirm",
			name: "confirm",
			message: "Commit with this message?",
			default: true,
		});

		if (confirm) {
			commitChanges(message);
			console.log("✅ Commit successful");
		} else {
			console.log("Commit cancelled");
		}
	} catch (error) {
		console.error("❌ Error:", error instanceof Error ? error.message : error);
		process.exit(1);
	}
}
