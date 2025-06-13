## Changelog

### Added
- `9b0605a9865440a1030882fd4a401428e3922226` (Its4Nik, 2025-06-13): 📦️ Build: Expose compiled CLI as executable.  This commit configures the compiled CLI script to be accessible as an executable command. By adding the `bin` entry to `package.json`, users can now directly run the `gitai` command after installation.

### Changed
- `5bc643f38bf042c6e0d5528fd9acc1cd1b7927a5` (Its4Nik, 2025-06-13): 📦 Update package name in README. Updates the package name in the README to reflect the new org `@its_4_nik`. This ensures users install and run the correct package.
- `8e890a9a5c0c457c11ff8f4ffe49670003b47c2f` (Its4Nik, 2025-06-13): 🔧 Update dev dependencies and ignore .bump.sh

### Fixed
- `a22b82e42dfbd70d2b05ee1021873f66815ca57e` (Its4Nik, 2025-06-13): 🐛 Fix: Corrected version number and added prepublish script. The version number in `package.json` was incorrect and has been decremented to `1.0.6`. Also added `prepublishOnly` script to ensure build runs before publishing.

### Removed
- `4b6bbff4965cfe93f9c12fe6c562789f01a352ce` (Its4Nik, 2025-06-13): Removes the publish script and adds `.bump.sh` to `.gitignore`. This simplifies the release process and prevents a potentially problematic file from being included in the published package.
- `26dfbd712ebdd414b5501ab7a70e2592f65ab3ab` (Its4Nik, 2025-06-13): 📦️ Release v1.0.6. Bumped version to 1.0.6 and removed linting from publish script to speed up deployment.