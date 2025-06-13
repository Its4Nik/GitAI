## Changelog

### Added
* **Initial commit: Introduce GitAI - AI-Powered Git Utilities** (`73520fd`, Its4Nik, 2025-06-13): Introduces GitAI, a CLI tool that leverages AI to enhance your Git workflow, along with initial project setup, including core features, documentation, configurations, and more.
* **feat: Initial project setup** (`9fdc74b`, Its4Nik, 2025-06-13): Initializes the project with basic structure, tooling, and initial configuration files, including:
    *   `.gitignore`: Excludes `node_modules`, build artifacts, and environment files.
    *   `README.md`: Includes installation and usage instructions.
    *   `biome.json`: Code formatting and linting configuration.
    *   `bun.lock`: Locks dependencies.
    *   `src/ai/providers`: Providers for Google Gemini and Ollama.
    *   `src/cli.ts`: Sets up command-line interface with `commander`.
    *   `package.json`: Includes dependencies and scripts.
    *   `src/commands`: Handles commit, version, changelog, and configuration commands.
    *   `src/config.ts`: Loads and saves configurations.
    *   `src/utils`: Manages git operations.
    *   `tsconfig.json`: TypeScript configuration.
    *   `src/prompts`: Sets up prompts and commit templates.
* **MIT License** (`60cf0ee`, Its4Nik, 2025-06-13): Adds an MIT License to the project.

### Changed
* **Improve build process** (`efe7c0a`, Its4Nik, 2025-06-13): Adds `--production --target=bun --minify` flags to the build script to optimize for production and reduce the bundle size.
* **Update .gitignore** (`6fdbac6`, Its4Nik, 2025-06-13): Updates `.gitignore` to exclude `node_modules`.

### Fixed
* **Refine commit message generation** (`60cf0ee`, Its4Nik, 2025-06-13): Refines the commit message generation process by removing a debug statement.