import { COMMIT_TEMPLATES } from "./templates";
import { GITMOJI_EXAMPLES } from "./templates";

export function generateCommitPrompt(
  diff: string,
  template = "conventional"
): string {
  let systemMessage = "Generate a commit message based on the following diff:";

  switch (template) {
    case "conventional":
      systemMessage += `\n\nUse Conventional Commits format:\n${COMMIT_TEMPLATES.conventional}`;
      break;
    case "angular":
      systemMessage += `\n\nUse Angular commit format:\n${COMMIT_TEMPLATES.angular}`;
      break;
    case "gitmoji":
      systemMessage += `\n\nUse Gitmoji commit format:\n${COMMIT_TEMPLATES.gitmoji}\n\nExamples of gitmojis:\n${GITMOJI_EXAMPLES}`;
      break;
    case "minimal":
      systemMessage += `\n\nUse Minimal commit format:\n${COMMIT_TEMPLATES.minimal}`;
      break;
    case "technical":
      systemMessage += `\n\nUse Technical commit format:\n${COMMIT_TEMPLATES.technical}`;
      break;
    default:
      systemMessage += "\n\nProvide a clear, concise commit message";
  }

  return `${systemMessage}\n\nDiff:\n${diff}\n\nDo not wrap the response in markdown code blocks.`;
}

export const generateVersionPrompt = (commits: string[]): string => {
  return `Based on these commit messages, suggest a semantic version bump (major, minor, patch):\n\n${commits.join(
    "\n"
  )}\n\nFollow semver rules:
  - MAJOR for breaking changes
  - MINOR for new features
  - PATCH for bug fixes

  Respond with only one word: major, minor, or patch. Do not wrap the response in markdown code blocks.`;
};

export const generateChangelogPrompt = (commits: string[]): string => {
  return `Generate a changelog entry for these commits:\n\n${commits.join(
    "\n\n"
  )}\n\nFormat as markdown with categories: Added, Changed, Fixed, Removed. Include commit hashes, authors, and dates. Do not wrap the response in markdown code blocks.`;
};
