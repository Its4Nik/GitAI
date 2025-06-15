#!/usr/bin/env bun
import { Command } from "commander";
import { changelogCommandSetup } from "./commands/changelog";
import { commitCommandSetup } from "./commands/commit";
import { configureCommandSetup } from "./commands/configure";
import { diffSummaryCommandSetup } from "./commands/diff-summary";
import { versionCommandSetup } from "./commands/version";
import { DebugLogger } from "./utils/logger";

const program = new Command();

program
	.name("GitAI")
	.description("AI-powered Git utilities")
	.version(process.env.GITAI_VERSION || "unkown")
	.option("-d, --debug", "Enable debug logging", false)
	.hook("preAction", (thisCommand) => {
		if (thisCommand.opts().debug) {
			process.env.AI_COMMIT_DEBUG = "1";
			console.log("Debug logging enabled");
		}
	})
	.hook("postAction", async () => {
		const logger = DebugLogger.getInstance();
		await logger.summarize();
	});

versionCommandSetup(program);
diffSummaryCommandSetup(program);
changelogCommandSetup(program);
configureCommandSetup(program);
commitCommandSetup(program);

program
	.command("debug-summary")
	.description("Show API usage summary")
	.action(async () => {
		const logger = DebugLogger.getInstance();
		await logger.summarize();
	});

program.parse(process.argv);
program.parse()
