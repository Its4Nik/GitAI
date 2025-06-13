import { Command } from "commander";
import { changelogCommand } from "./commands/changelog";
import { commitCommand } from "./commands/commit";
import { configureCommand } from "./commands/configure";
import { versionCommand } from "./commands/version";

const program = new Command();

program
  .name("ai-commit")
  .description("AI-powered Git utilities")
  .version("0.1.0");

program
  .command("commit")
  .description("Generate commit message using AI")
  .option("-t, --template <template>", "Commit message template")
  .option("-m, --model <model>", "AI model to use")
  .action(commitCommand);

program
  .command("version")
  .description("Suggest semantic version upgrade")
  .action(versionCommand);

program
  .command("changelog")
  .description("Generate changelog using AI")
  .action(changelogCommand);

program
  .command("configure")
  .description("Configure AI providers")
  .action(configureCommand);

program.parse(process.argv);
