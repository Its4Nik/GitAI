## Changelog

### Added
*   **Initial commit: Introduce GitAI - AI-Powered Git Utilities** - (6fdbac6) - *Its4Nik* - 2025-06-13
    *   Introduces GitAI, a CLI tool that leverages AI to enhance your Git workflow.
    *   Implemented core features:
        *   Changelog Generation
        *   AI-Generated Commit Messages
        *   Semantic Version Suggestions
        *   Support for Google Gemini, Ollama, OpenAI, and more
        *   Debug Tools
        *   Commit Templates: Conventional Commits, Angular, Gitmoji, and custom formats
    *   Updated README with installation instructions, configuration details, usage examples, and contribution guidelines.
    *   Adds `.gitignore` to exclude node_modules, build artifacts, and environment files.
    *   Initial project setup
        *   Adds `README.md` with installation and usage instructions.
        *   Adds `biome.json` for code formatting and linting configuration.
        *   Adds `package.json` with dependencies and scripts.
        *   Adds `src/ai/providers` with providers for Google Gemini and Ollama.
        *   Adds `bun.lock` to lock dependencies.
        *   Adds `src/cli.ts` to setup command line interface with `commander`.
        *   Adds `src/commands` to handle commit, version, changelog, and configuration commands.
        *   Adds `src/prompts` to set up prompts and commit templates.
        *   Adds `src/utils` to manage git operations.
        *   Adds `src/config.ts` to load and save configurations.
        *   Adds `tsconfig.json` for TypeScript configuration.

### Changed

### Fixed

### Removed
*   Exclude config file. - (9fdc74b) - *Its4Nik* - 2025-06-13
    *   Added `.gitai.json` to `.gitignore` to exclude the config file.
*   **Update .gitignore to exclude node_modules** - (73520fd) - *Its4Nik* - 2025-06-13