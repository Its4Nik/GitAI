# gitai: AI-Powered Git Utilities

![gitai CLI](https://img.shields.io/badge/Bun-v1.0.0-ffd43b?logo=bun) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

GitAi is a CLI tool that leverages AI to enhance your Git workflow. Generate commit messages, suggest semantic version bumps, create changelogs, and more - all powered by AI providers like Google Gemini, Ollama, and OpenAI.

## Features ✨

- **AI-Generated Commit Messages**: Create meaningful commit messages from staged changes
- **Semantic Version Suggestions**: Get version bump recommendations (major/minor/patch)
- **Changelog Generation**: Automatically create detailed changelogs
- **Multiple AI Providers**: Support for Google Gemini, Ollama, OpenAI, and more
- **Diff Summary**: Create summaries of changes between 2 commits or tags.
- **Commit Templates**: Conventional Commits, Angular, Gitmoji, and custom formats
- **Debug Tools**: Track API usage and debug AI interactions

## Installation ⚡

```bash
# Install globally with Bun
bun add -g @its_4_nik/gitai
npm install -g @its_4_nik/gitai
yarn global add @its_4_nik/gitai

# Or run directly with:
bunx @its_4_nik/gitai
npx @its_4_nik/gitai
```

## Configuration ⚙️

First, configure your AI providers:

```bash
gitai configure
```

Follow the interactive prompts to:
1. Select your default AI provider
2. Configure provider-specific settings (API keys, models)
3. Choose your preferred commit template
4. Set the max commits to analyze for version/changelog

Configuration is saved to `~/gitai.json` or your project directory `.gitai.json`

## Usage 🚀

### Generate a Commit Message

```bash
# Stage your changes first
git add .

# Generate commit message
gitai commit

# Use a specific template
gitai commit --template gitmoji
```

### Suggest Version Bump

```bash
# Suggest semantic version bump based on recent commits
gitai version
```

### Generate Changelog

```bash
# Print changelog to console
gitai changelog

# Save changelog to file
gitai changelog --output CHANGELOG.md
```

### Create diff summary

```bash
# Print to console
gitai diff-summary HEAD v1.1.3
```

```
Diff Summary (HEAD → v1.1.3):

The diff reveals several significant changes related to publishing, dependency management, and overall workflow. The `release-publish.yaml` workflow has been modified to remove permissions for `id-token`, simplify the version setting process by directly calling `npm version` without checking for existing tags, and transition to `bun publish` for publishing to npm using a `NODE_AUTH_TOKEN` environment variable. Additionally, the `bun.lock` file shows that the `ignore` package was removed, and several dependencies were updated including `camelcase` and `glob`. The `package.json` file had a version change to `1.0.14`, removed the repository URL, and had a minor update to typescript version dependencies.

Here's a short listing of changes:
*   `.github/workflows/release-publish.yaml`: Modified publishing workflow to use bun, and updated versioning logic.
*   `bun.lock`: Removed `ignore` package and updated a number of packages.
*   `package.json`: Version bump and repository url removal.

**Really short summary: The workflow transitions to using bun for publishing, updates dependencies, and removes repository URL.**
```

---

```bash
# Format as markdown
gitai diff-summary --markdown HEAD v1.1.3
```

```markdown
## Diff Summary: HEAD → v1.1.3

The changes between `HEAD` and `v1.1.3` involve modifications to the release publishing workflow and dependency updates.

Here's a summary of the key differences:

*   **Release Workflow:**
    *   The release workflow (`.github/workflows/release-publish.yaml`) had several modifications.
    *   The `permissions` block used for authentication was removed.
    *   The workflow no longer checks for the existence of a tag before executing `npm version`, instead always running `npm version "$TAG_NAME"`
    *   The workflow was updated to use bun to publish to npm.
*   **Dependency Updates:**
    *   The `bun.lock` file shows several dependency version updates, including `camelcase` and `glob`.
    *   The `ignore` dependency was removed from `bun.lock`

Short listing of changes:
* Removed permissions block from github workflow
* Changed publishing mechanism to use bun
* Upgraded many dependencies in bun.lock
* Removed ignore dependency
* Removed repository metadata

Breaking changes: None
```




### Debug API Usage

```bash
# Enable debug mode for any command
gitai commit --debug

# View API usage summary
gitai debug-summary
```

## Examples 📋

### Gitmoji-style Commit
```
✨ Add dark mode toggle
- Implemented theme switching
- Added persistence
- Updated UI components
```

### Version Suggestion
```
$ gitai version
Suggested version bump: minor
```

### Changelog Output
```markdown
## [1.1.0] - 2025-06-15

### Added
- Dark mode toggle (#42) [9fdc74b]
- User preferences page

### Fixed
- Header alignment issue (#38) [a1b2c3d]
```

## Commit Templates 📝

AI Commit supports multiple commit templates:

| Template        | Format                          |
|-----------------|---------------------------------|
| Conventional    | `<type>: <description>`         |
| Angular         | `<type>(<scope>): <subject>`    |
| Gitmoji         | `✨ <subject>`                   |
| Minimal         | `<subject>`                     |
| Technical       | `<type>(<scope>): <ticket>`     |

## Supported AI Providers 🤖

| Provider | Models                  | Required Config         |
|----------|-------------------------|-------------------------|
| Google Gemini | `gemini-pro`, `gemini-1.5-flash`, `gemini-2.0-flash`, `gemini-2.0-flash-lite`, | API Key                |
| Ollama   | `llama3`, `mistral`, etc. | Base URL (optional)    |
| OpenAI   | `gpt-4`, `gpt-3.5-turbo` | API Key                |

## Debugging 🐛

Enable debug mode to track API usage:

```bash
gitai commit --debug
```

View API usage summary:
```bash
gitai debug-summary

# Sample output
API Request Summary:
====================
Total Requests: 12
Total Prompt Chars: 5482
Total Response Chars: 1248
Average Duration: 1243ms

By Command:
- commit: 8
- version: 2
- changelog: 2

By Provider:
- gemini: 12

By Model:
- gemini-pro: 12
```

Detailed logs are saved to `gitai-debug.log`

## Contributing 🤝

Please See [Contributing](./CONTRIBUTE.md)

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support ❤️

If you find this tool useful, please consider starring the repository on [GitHub](https://github.com/Its4Nik/GitAI)!
