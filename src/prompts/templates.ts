export const ConventionalCommit = `
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
`.trim();

export const AngularCommit = `
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
`.trim();

export const GitmojiCommit = `
<gitmoji> <subject>

[optional body]

[optional footer(s)]
`.trim();

export const MinimalCommit = `
<subject>

[optional body]
`.trim();

export const TechnicalCommit = `
<type>(<scope>): <subject> [<ticket>]

<body>
`.trim();

export const COMMIT_TEMPLATES: Record<string, string> = {
	conventional: ConventionalCommit,
	angular: AngularCommit,
	gitmoji: GitmojiCommit,
	minimal: MinimalCommit,
	technical: TechnicalCommit,
};

export const GITMOJI_EXAMPLES = `
🚀 New feature
🐛 Bug fix
📝 Documentation
🎨 Code structure
♻️ Refactoring
✅ Tests
🔥 Remove code
🚑️ Critical fix
✨ New feature
💄 UI update
`.trim();

export const SEMVER_CATEGORIES = {
	major: ["BREAKING CHANGE", "breaking"],
	minor: ["feat", "feature", "✨"],
	patch: [
		"fix",
		"perf",
		"revert",
		"docs",
		"style",
		"refactor",
		"test",
		"chore",
		"🐛",
	],
} as const;
