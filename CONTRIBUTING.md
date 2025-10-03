# Contributing to Kuhmpel

Thank you for your interest in contributing to Kuhmpel! This guide will help you get started.

## Getting Started

### Prerequisites

- **Node.js**: Version 20.x or later
- **Package Manager**: npm (comes with Node.js) or yarn
- **Git**: For version control
- **VS Code**: For development and testing

### Initial Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/clauder.git
   cd clauder
   ```

2. **Navigate to Extension Directory**
   ```bash
   cd extension
   ```

3. **Install Dependencies**

   Using npm (recommended):
   ```bash
   npm run install:all
   ```

   This single command installs dependencies for both:
   - The main extension code
   - The webview UI (built with React + Vite)

   Alternatively, using yarn:
   ```bash
   yarn install
   cd webview-ui-vite && yarn install
   ```

## Development Workflow

### Running the Extension

1. **Open in VS Code**
   ```bash
   code .
   ```

2. **Start Development Mode**
   - Press `F5` to launch the Extension Development Host
   - This opens a new VS Code window with the extension loaded

3. **Making Changes**
   - **Webview changes**: Hot-reload automatically
   - **Extension code changes**: Reload the extension host (`Cmd/Ctrl + R`)

### Building

- **Build Webview UI**
  ```bash
  npm run build:webview
  ```

- **Compile Extension**
  ```bash
  npm run compile
  ```

- **Watch Mode** (auto-rebuild on changes)
  ```bash
  npm run watch
  ```

### Testing

- **Run Tests**
  ```bash
  npm test
  ```

- **Run Webview Tests**
  ```bash
  npm run test:webview
  ```

## Project Structure

```
extension/
├── src/                    # Main extension source code
│   ├── agent/             # AI agent implementation
│   ├── api/               # Provider API handlers
│   ├── providers/         # Extension state management
│   ├── shared/            # Shared utilities
│   └── extension.ts       # Extension entry point
│
├── webview-ui-vite/       # React-based UI
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # UI utilities
│   └── vite.config.ts     # Vite configuration
│
└── dist/                  # Compiled extension code
```

## Code Style

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint configured
  ```bash
  npm run lint
  ```
- **Formatting**: Follow existing code style
- **Type Safety**: Ensure all TypeScript code is properly typed

## Making Changes

### Adding a New Provider

See the [Provider Implementation Guide](extension/src/api/providers/README.md) for detailed instructions.

### UI Changes

1. Navigate to `webview-ui-vite/src/components/`
2. Make your changes
3. The development server will hot-reload
4. Test in the Extension Development Host

### Extension Code Changes

1. Make changes in `src/`
2. Reload the extension host (`Cmd/Ctrl + R`)
3. Test your changes

## Submitting Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, documented code
   - Follow existing patterns
   - Add tests if applicable

3. **Test Your Changes**
   ```bash
   npm run compile
   npm test
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `refactor:` for code refactoring
   - `test:` for test additions/changes

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub

## Common Tasks

### Clean Build
```bash
npm run clean
npm run install:all
npm run compile
```

### Update Dependencies
```bash
npm update
cd webview-ui-vite && npm update
```

### Debug Extension
- Set breakpoints in VS Code
- Press `F5` to start debugging
- Use the Debug Console for output

## Troubleshooting

### Build Errors

**Issue**: TypeScript compilation errors
- Run `npm run check-types` to see all type errors
- Ensure all imports are correct
- Check for missing dependencies

**Issue**: Webview not building
- Clear the dist folder: `rm -rf webview-ui-vite/dist`
- Rebuild: `npm run build:webview`

### Development Issues

**Issue**: Extension not loading
- Check the Output panel in VS Code (select "Extension Host")
- Look for error messages
- Try reloading the window

**Issue**: Changes not reflecting
- For webview: Check if dev server is running
- For extension: Reload extension host (`Cmd/Ctrl + R`)
- For deeper issues: Close and reopen Extension Development Host

## Getting Help

- **Documentation**: Check our comprehensive guides
- **Issues**: Search existing issues or create a new one
- **Discord**: Join our community for real-time help
- **Code Review**: Don't hesitate to ask for feedback on PRs

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow our community guidelines

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (AGPL-3.0-or-later).

---

Thank you for contributing to Kuhmpel! Your efforts help make development more accessible and efficient for everyone. 🚀
