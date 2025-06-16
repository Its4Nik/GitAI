# Contributing to GitAI

We welcome contributions from the community! Whether you're adding a new AI provider, fixing bugs, or improving documentation, your help makes GitAI better for everyone.

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) v1.0 or later
- Node.js v18 or later
- Git

### Setup Instructions
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/Its4Nik/gitai.git
   cd gitai
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Build the project:
   ```bash
   bun run build
   ```
5. Link for local testing:
   ```bash
   bun link
   ```

## Adding New AI Providers

GitAI supports multiple AI providers through a modular architecture. Here's how to add a new provider:

### 1. Create Provider File
Create a new file in `src/ai/providers/`:
```typescript
// src/ai/providers/new-provider.ts
import type { AIProvider, ProviderConfig } from './types';

export const NewProvider: AIProvider = {
  generate: async (prompt, config: ProviderConfig = {}) => {
    // Implement your API call here
    try {
      const response = await fetch('https://api.newprovider.com/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || 'default-model',
          prompt,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].text.trim();
    } catch (error) {
      throw new Error(`NewProvider error: ${error instanceof Error ? error.message : error}`);
    }
  },

  // List supported models
  models: ['model1', 'model2']
};
```

### 2. Add to Provider Registry
Update `src/ai/providers/index.ts`:
```typescript
import { NewProvider } from './new-provider';
// ... other imports ...

export const PROVIDERS: Record<string, AIProvider> = {
  // ... existing providers ...
  'newprovider': NewProvider
};
```

### 3. Add Configuration Support
Update the configure command in `src/commands/configure.ts`:
```typescript
// Inside the provider configuration loop
if (name === 'newprovider') {
  const { apiKey } = await inquirer.prompt({
    type: 'password',
    name: 'apiKey',
    message: 'Enter NewProvider API key:',
    default: providerConfig.apiKey || process.env.NEWPROVIDER_API_KEY || ''
  });
  providerConfig.apiKey = apiKey;
}
```

### 4. Update Types
Add any necessary types in `src/ai/providers/types.ts`:
```typescript
export interface ProviderConfig {
  // ... existing properties ...
  newproviderApiKey?: string;
}
```

### 5. Add Documentation
Update the README.md to include your new provider in the supported providers list.

## Development Workflow

### Code Structure
```
src/
├── ai/                # AI provider implementations
├── commands/          # CLI command handlers
├── prompts/           # Prompt templates
├── utils/             # Utility functions
├── cli.ts             # Main CLI entry point
└── config.ts          # Configuration handling
```

### Building the Project
```bash
bun run build
```

### Testing Your Changes
```bash
# Link your local build
bun link

# Test your command
gitai --help
gitai commit --debug
```

### Linting and Formatting
We use Biome for code formatting and linting:
```bash
bun run lint    # Check for errors
bun run format  # Format code
```

### Submitting a Pull Request
1. Create a new branch: `git checkout -b feat/new-provider`
2. Commit your changes: `git commit -am 'feat: add NewProvider support'`
3. Push to your fork: `git push origin feat/new-provider`
4. Create a pull request to the main repository

## Commit Guidelines
Please follow Conventional Commits format:
```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

Common types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```
feat(providers): add NewProvider integration

- Implement NewProvider API client
- Add configuration support
- Update documentation
```

## Testing

We're working to add a comprehensive test suite. Contributions for tests are welcome! Currently:

1. Manual testing of commands is required

## Reporting Issues
Please report bugs and feature requests on our [GitHub Issues](https://github.com/its4nik/gitai/issues) page. Include:

1. Steps to reproduce
2. Expected vs actual behavior
3. Environment details (OS, Bun version, etc.)
4. Error logs if applicable

## License
By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

Thank you for helping make GitAI better! 🚀
