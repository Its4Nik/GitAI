import { ConventionalCommit } from "./templates";

export function generateCommitPrompt(
  diff: string,
  template = "conventional"
): string {
  let systemMessage = "Generate a commit message based on the following diff:";

  switch (template) {
    case "conventional":
      systemMessage += `\n\nUse Conventional Commits format:\n${ConventionalCommit}`;
      break;
    case "angular":
      systemMessage +=
        "\n\nUse Angular commit format: <type>(<scope>): <subject>";
      break;
    default:
      systemMessage += "\n\nProvide a clear, concise commit message";
  }

  return `${systemMessage}\n\nDiff:\n${diff}`;
}

export const generateVersionPrompt = (commits: string[]): string => {
  return `Based on these commits, suggest a semantic version bump (major, minor, patch):\n\n${commits.join(
    "\n"
  )}\n\nFollow semver rules:
  - MAJOR for breaking changes
  - MINOR for new features
  - PATCH for bug fixes

  Respond with only one word: major, minor, or patch.`;
};

export const generateChangelogPrompt = (commits: string[]): string => {
  return `Generate a changelog entry for these commits:\n\n${commits.join(
    "\n"
  )}\n\nFormat as markdown with categories: Added, Changed, Fixed, Removed.`;
};
