# Rohit Dashboard Widget

A React dashboard widget component library.

## Installation

Install from GitHub:

```bash
# Using npm
npm install github:rohitcoding1991/rohit-dashboard-widget

# Using yarn
yarn add github:rohitcoding1991/rohit-dashboard-widget
```

## Setup

This package depends on private Telesero packages. You need to configure access to the Telesero registry:

1. Copy `.npmrc.example` to `.npmrc`:
   ```bash
   cp .npmrc.example .npmrc
   ```

2. Copy `.yarnrc.example` to `.yarnrc`:
   ```bash
   cp .yarnrc.example .yarnrc
   ```

3. Set the `TELESERO_NPM_TOKEN` environment variable with your Telesero registry token:
   ```bash
   export TELESERO_NPM_TOKEN=your-token-here
   ```

## Usage

```javascript
import { YourComponent } from '@rohitcoding1991/rohit-dashboard-widget';

// Use the component in your React app
function App() {
  return <YourComponent />;
}
```

## Building from Source

```bash
# Install dependencies
yarn install

# Build the project
yarn build
```

## GitHub Actions Setup

This repository uses GitHub Actions for CI/CD with automatic versioning. To set up the workflow:

1. Go to your GitHub repository settings
2. Navigate to **Settings > Secrets and variables > Actions**
3. Add a new repository secret:
   - Name: `TELESERO_NPM_TOKEN`
   - Value: Your Telesero npm registry token

### Automatic Versioning

The workflow uses **Conventional Commits** for automatic version bumping:

- `fix:` commits → Patch version bump (1.0.0 → 1.0.1)
- `feat:` commits → Minor version bump (1.0.0 → 1.1.0)
- `feat!:` or `BREAKING CHANGE:` → Major version bump (1.0.0 → 2.0.0)

**Example commit messages:**
```bash
git commit -m "fix: resolve build error with ES6 syntax"
git commit -m "feat: add new dashboard widget component"
git commit -m "feat!: redesign widget API (breaking change)"
```

The workflow will automatically:
- Run tests on all pushes and pull requests
- Bump version based on commit messages
- Create git tags (v1.0.18, v1.0.19, etc.)
- Build the package on master branch
- Create GitHub releases with changelog
- Upload build artifacts to the release

## License

Proprietary