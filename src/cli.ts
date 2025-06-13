#!/usr/bin/env bun
import { Command } from "commander";
import { changelogCommandSetup } from "./commands/changelog";
import { commitCommand } from "./commands/commit";
import { configureCommand } from "./commands/configure";
import { versionCommandSetup } from "./commands/version";
import { DebugLogger } from "./utils/logger";

const program = new Command();

program
  .name("gitai")
  .description("AI-powered Git utilities")
  .version("1.0.6")
  .option("--debug", "Enable debug logging", false)
  .hook("preAction", (thisCommand) => {
    if (thisCommand.opts().debug) {
      process.env.AI_COMMIT_DEBUG = "1";
      console.log("Debug logging enabled");
    }
  })
  .hook("postAction", async () => {
    const logger = DebugLogger.getInstance();
    await logger.summarize();
  })
  .command("commit")
  .description("Generate commit message using AI")
  .option("-t, --template <template>", "Commit message template")
  .option("-m, --model <model>", "AI model to use")
  .action(commitCommand);

versionCommandSetup(program);
changelogCommandSetup(program);

program
  .command("configure")
  .description("Configure AI providers")
  .action(configureCommand);

program
  .command("debug-summary")
  .description("Show API usage summary")
  .action(async () => {
    const logger = DebugLogger.getInstance();
    await logger.summarize();
  });

program.parse(process.argv);
