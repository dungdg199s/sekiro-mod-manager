# Contributing to Sekiro Mod Manager

Thank you for considering contributing to Sekiro Mod Manager! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (screenshots, error messages, logs)
- **Describe the behavior you observed** and what you expected
- **Include system information**: Windows version, Node.js version, app version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any similar features** in other applications if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write a clear commit message** describing your changes
6. **Submit a pull request** with a comprehensive description

## Code Style Guidelines

### JavaScript/Electron

- Use **single quotes** for strings
- Use **2 spaces** for indentation
- Use **semicolons**
- Run `yarn format` before committing
- Follow existing code patterns in the project

### File Organization

```
src/
├── main/
│   ├── main.js      # Main Electron process entry
│   ├── handlers.js  # IPC handlers
│   └── helpers.js   # Utility functions
├── preload/
│   └── preload.js   # Preload script for renderer
└── renderer/
    ├── index.html   # UI markup
    ├── renderer.js  # Client-side logic
    ├── styles.css   # Styling
    └── translations.js # Internationalization
```

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests after first line

Examples:
```
Add RAR file support for mod archives

Fix conflict detection for nested directories

Update Vietnamese translations for status messages
```

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/sekiro-mod-manager.git
cd sekiro-mod-manager

# Install dependencies
yarn install

# Run in development mode
yarn dev

# Format code
yarn format
```

## Testing

Before submitting a pull request:

1. Test basic functionality:
   - Upload a mod (ZIP and RAR)
   - Activate/deactivate mods
   - Edit mod information
   - Delete mods
   - Drag and drop files
   - Reorder mods

2. Test edge cases:
   - Multiple mod conflicts
   - Invalid game directory
   - Large mod files
   - Special characters in mod names

3. Test in both languages (Vietnamese and English)

## Questions?

Feel free to open an issue with the label "question" if you need help or clarification.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards others

Thank you for contributing! 🙏
