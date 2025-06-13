export const ConventionalCommit = `
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
`.trim();

export const SEMVER_CATEGORIES = {
  major: ["BREAKING CHANGE", "breaking"],
  minor: ["feat", "feature"],
  patch: [
    "fix",
    "perf",
    "revert",
    "docs",
    "style",
    "refactor",
    "test",
    "chore",
  ],
} as const;
