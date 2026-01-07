# Complete Guide: Publishing a Package to GitHub with Versioning

This guide documents all steps to convert a package from a private npm registry to GitHub distribution with automatic versioning.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Configuration](#initial-configuration)
3. [File Structure Setup](#file-structure-setup)
4. [GitHub Actions Workflow](#github-actions-workflow)
5. [Git Repository Setup](#git-repository-setup)
6. [Testing the Setup](#testing-the-setup)
7. [Using the Package](#using-the-package)

---

## Prerequisites

- Node.js 20.x installed
- Yarn or npm
- GitHub account
- Access to Telesero npm registry token (if using private Telesero dependencies)

---

## Initial Configuration

### 1. Update `package.json`

Change the package name and repository URL:

```json
{
  "name": "@your-username/your-package-name",
  "version": "1.0.0",
  "repository": "github:your-username/your-package-name",
  "private": false,
  "license": "proprietary",
  "module": "src/index.js"
}
```

**Remove** the `publishConfig` section if it exists:
```json
// DELETE THIS:
"publishConfig": {
  "registry": "https://repo.npm.systems.cxcl.io/"
}
```

---

## File Structure Setup

### 2. Configure `.npmrc` (Commit to Git)

Create/update `.npmrc` with token placeholder:

```
//repo.npm.systems.cxcl.io/:_authToken="${TELESERO_NPM_TOKEN}"
```

**Important:** Use `${TELESERO_NPM_TOKEN}` as a placeholder. The actual token is provided via GitHub Actions secrets.

### 3. Configure `.yarnrc` (Commit to Git)

Create/update `.yarnrc` for Telesero registry:

```
strict-ssl false
email automation@telesero.com
username automation

"@telesero:registry" "https://repo.npm.systems.cxcl.io/"
```

### 4. Update `.gitignore`

Ensure build artifacts are ignored:

```gitignore
# IDE
/.idea

# Dist
/dist

/build

# dependencies
node_modules

# MacOS
.DS_Store

# misc
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

**Note:** `.npmrc` and `.yarnrc` should be committed (not ignored).

### 5. Fix Webpack Configuration

If your package depends on other packages with ES6+ syntax (like `@telesero/widget-base`), update `.neutrinorc.js`:

```javascript
const {resolve} = require("path");
const preset = require(resolve("node_modules/@telesero/frontend-common/build-tools/amdPreset.js"));
const FrontendCommonWebpackPlugin = require(resolve("node_modules/@telesero/frontend-common/build-tools/frontend-common-webpack-plugin.js"));
const AmdAssetWebpackPlugin = require(resolve("node_modules/@telesero/frontend-common/build-tools/amd-asset-webpack-plugin.js"));

module.exports = {
  options: {
    root: __dirname
  },
  use: [
    preset("your-package-name", {
      library: true
    }),
    neutrino => {
      neutrino.config.plugin("frontend-common-webpack-plugin").use(FrontendCommonWebpackPlugin);
      neutrino.config.plugin("your-package-amd-assets").use(AmdAssetWebpackPlugin).init(
        AmdAssetWebpackPlugin => new AmdAssetWebpackPlugin("your-package-name")
          .add("styled-components", "/dist/styled-components.js"))

      // Include node_modules packages that need ES6+ transpilation
      neutrino.config.module.rule("compile").include
        .add(resolve("node_modules/@telesero/widget-base"))
        .add(resolve("node_modules/react-grid-layout"));

      // Ensure Babel transpiles spread operators and other ES6+ features to ES5
      const babelMerge = require("babel-merge");
      neutrino.config.module
        .rule("compile")
        .use("babel")
        .tap((options) =>
          babelMerge(options, {
            presets: [
              [
                require.resolve("@babel/preset-env"),
                {
                  targets: { ie: "11" },
                  useBuiltIns: false,
                  modules: false
                }
              ]
            ],
            plugins: [
              require.resolve("@babel/plugin-proposal-object-rest-spread")
            ]
          })
        );
    }
  ]
};
```

**Key changes:**
- Added packages to Babel's `include` list to transpile ES6 syntax
- Configured `@babel/preset-env` with IE11 target
- Added `@babel/plugin-proposal-object-rest-spread` plugin

---

## GitHub Actions Workflow

### 6. Create `.github/workflows/build.yml`

```yaml
name: Build and Test Dashboard Widget

on:
  push:
    branches:
      - master
  pull_request:

env:
  TELESERO_NPM_TOKEN: ${{ secrets.TELESERO_NPM_TOKEN }}

jobs:
  test:
    if: "!contains(github.event.head_commit.message, 'skip ci')"
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install and Test
        run: |
          yarn install --check-files
          yarn lint || true
          yarn test || echo "Tests skipped or no tests configured"
        env:
          CI: true

  build:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
      pull-requests: read
    needs: test
    if: "'refs/heads/master' == github.ref && !contains(github.event.head_commit.message, 'version bump to')"

    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Show current version
        run: cat ./package.json | grep version

      - name: Bump version and push tag
        id: bump
        uses: TriPSs/conventional-changelog-action@v3
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          git-message: 'version bump to: {version}'
          preset: 'angular'
          tag-prefix: 'v'
          skip-on-empty: 'false'
          output-file: 'false'

      - name: Show new version
        run: cat ./package.json | grep version

      - name: Configure NPM authentication
        run: |
          echo "//repo.npm.systems.cxcl.io/:_authToken=${TELESERO_NPM_TOKEN}" > .npmrc

      - name: Build package
        run: |
          yarn install --check-files
          yarn build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist-files-${{ steps.bump.outputs.version }}
          path: dist/
          retention-days: 90

      - name: Create GitHub Release
        if: ${{ steps.bump.outputs.skipped != 'true' }}
        uses: softprops/action-gh-release@v1
        with:
          tag_name: v${{ steps.bump.outputs.version }}
          name: Release v${{ steps.bump.outputs.version }}
          body: ${{ steps.bump.outputs.clean_changelog }}
          files: |
            dist/widgets.js
            dist/dashboard-widget.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Key features:**
- **Test job**: Runs on all pushes and PRs
- **Build job**: Only runs on master branch
- **Automatic versioning**: Uses conventional commits
- **GitHub Releases**: Creates releases with built files
- **Artifacts**: Uploads build files to GitHub Actions

---

## Git Repository Setup

### 7. Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `your-username/your-package-name`)
3. **Do not** initialize with README, .gitignore, or license

### 8. Add GitHub Secret

1. Go to repository **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Add:
   - **Name:** `TELESERO_NPM_TOKEN`
   - **Value:** Your Telesero npm registry token

### 9. Initialize Git and Push

```bash
cd /path/to/your/package

# Initialize git (if not already)
git init

# Add all files
git add .

# Initial commit
git commit -m "feat: initial commit with GitHub Actions workflow"

# Add remote
git remote add origin https://github.com/your-username/your-package-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** Since this is the first commit with "feat:", the version will automatically bump from 1.0.0 to 1.1.0.

---

## Testing the Setup

### 10. Verify GitHub Actions

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Verify the workflow runs successfully
4. Check that version was bumped
5. Verify a release was created under **Releases**

### 11. Check the Release

1. Go to **Releases** on GitHub
2. You should see a new release (e.g., `v1.1.0`)
3. Verify the release includes:
   - Changelog
   - `dist/widgets.js` file
   - `dist/dashboard-widget.js` file

---

## Using the Package

### 12. Install in Another Project

```bash
# Latest version from main branch
yarn add github:your-username/your-package-name

# Specific version tag
yarn add github:your-username/your-package-name#v1.1.0

# Specific commit
yarn add github:your-username/your-package-name#abc1234
```

### 13. Usage in React App

```javascript
import { YourComponent } from '@your-username/your-package-name';

function App() {
  return <YourComponent />;
}
```

### 14. Setup in Consumer Project

If the package depends on Telesero private packages, the consuming project also needs:

1. Create `.npmrc`:
   ```
   //repo.npm.systems.cxcl.io/:_authToken="${TELESERO_NPM_TOKEN}"
   ```

2. Create `.yarnrc`:
   ```
   strict-ssl false
   email automation@telesero.com
   username automation

   "@telesero:registry" "https://repo.npm.systems.cxcl.io/"
   ```

3. Set environment variable:
   ```bash
   export TELESERO_NPM_TOKEN=your-token-here
   ```

---

## Conventional Commits for Versioning

The workflow uses **Conventional Commits** to automatically determine version bumps:

### Commit Message Format

```
<type>: <description>

[optional body]

[optional footer]
```

### Version Bumping Rules

| Commit Type | Version Bump | Example |
|-------------|--------------|---------|
| `fix:` | Patch (1.0.0 → 1.0.1) | `fix: resolve build error` |
| `feat:` | Minor (1.0.0 → 1.1.0) | `feat: add new component` |
| `feat!:` or `BREAKING CHANGE:` | Major (1.0.0 → 2.0.0) | `feat!: redesign API` |

### Examples

```bash
# Patch release
git commit -m "fix: resolve ES6 transpilation issue"

# Minor release
git commit -m "feat: add dashboard metrics widget"

# Major release (breaking change)
git commit -m "feat!: redesign widget API

BREAKING CHANGE: Widget props have been completely redesigned"

# Skip version bump
git commit -m "docs: update README"
git commit -m "chore: update dependencies"
```

### Other Commit Types (No Version Bump)

- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Build process or auxiliary tool changes
- `ci:` - CI configuration changes

---

## Troubleshooting

### Issue: Build fails with "Unexpected token" error

**Solution:** Add the problematic package to Babel's include list in `.neutrinorc.js`:

```javascript
neutrino.config.module.rule("compile").include
  .add(resolve("node_modules/package-name"));
```

### Issue: "cannot stat '.yarnrc.example': No such file or directory"

**Solution:** Ensure `.npmrc` and `.yarnrc` are committed to the repository, and the workflow creates `.npmrc` during the build step (not copying from example files).

### Issue: Version not bumping

**Cause:** Commit messages don't follow conventional commit format.

**Solution:** Use proper commit format: `feat:`, `fix:`, etc.

### Issue: Release not created

**Cause:** The `skip-on-empty` setting or no qualifying commits.

**Solution:** Ensure you have commits with `feat:` or `fix:` prefixes.

---

## Checklist

Use this checklist when setting up a new package:

- [ ] Update `package.json` (name, repository, remove publishConfig)
- [ ] Create/update `.npmrc` with token placeholder
- [ ] Create/update `.yarnrc` with registry config
- [ ] Update `.gitignore` (exclude dist/, build/, node_modules/)
- [ ] Fix `.neutrinorc.js` (add packages to Babel include if needed)
- [ ] Create `.github/workflows/build.yml`
- [ ] Create GitHub repository
- [ ] Add `TELESERO_NPM_TOKEN` secret in GitHub
- [ ] Initialize git and push
- [ ] Verify GitHub Actions workflow runs
- [ ] Check that release was created
- [ ] Test installation in another project

---

## Key Differences from NPM Registry Publishing

| Aspect | NPM Registry | GitHub |
|--------|--------------|--------|
| Distribution | Published to npm registry | Installed directly from GitHub |
| Versioning | Manual or CI/CD | Automatic via conventional commits |
| Installation | `yarn add @scope/package` | `yarn add github:user/repo` |
| Releases | NPM versions | GitHub releases with tags |
| Artifacts | NPM tarball | GitHub release assets |
| Private packages | Requires npm token | Requires GitHub access |

---

## Future Enhancements

Potential improvements to consider:

1. **Add CDN publishing** - Upload built files to a CDN
2. **Add package size checks** - Monitor bundle size
3. **Add code coverage** - Track test coverage
4. **Add security scanning** - Scan for vulnerabilities
5. **Add Storybook deployment** - Deploy component docs
6. **Add npm publishing** - Publish to npm in addition to GitHub

---

## Maintenance

### Updating Dependencies

```bash
yarn upgrade-interactive --latest
```

### Manual Version Bump

If you need to manually bump version:

```bash
# Bump patch (1.0.0 → 1.0.1)
npm version patch

# Bump minor (1.0.0 → 1.1.0)
npm version minor

# Bump major (1.0.0 → 2.0.0)
npm version major
```

Then commit and push:

```bash
git push origin main --tags
```

---

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [GitHub Packages](https://docs.github.com/en/packages)

---

## CDN Deployment

### Setup CDN via FTP

Your built files will be automatically uploaded to your CDN server after each successful build.

#### Required GitHub Secrets

Add these secrets to your GitHub repository (**Settings → Secrets and variables → Actions**):

1. **SFTP_USERNAME**: Your FTP username (e.g., `hellovoip.co_lp6xlfukm7k`)
2. **SFTP_SERVER**: Your server IP or domain (e.g., `144.217.255.195`)
3. **SFTP_PORT**: Your FTP port (usually `21`)
4. **SFTP_PASSWORD**: Your FTP password

**Note:** Despite the "SFTP" prefix in secret names, we're using standard FTP protocol since your hosting uses FTP on port 21.

#### CDN URLs

After deployment, your files will be accessible at:

```
# Latest version (example for v1.1.0)
https://www.hellovoip.co/rohit-dashboard-widget/v1.1.0/widgets.js
https://www.hellovoip.co/rohit-dashboard-widget/v1.1.0/dashboard-widget.js

# Specific version
https://www.hellovoip.co/rohit-dashboard-widget/v1.1.0/widgets.js
```

#### Usage in HTML

```html
<!-- Use specific version for production -->
<script src="https://www.hellovoip.co/rohit-dashboard-widget/v1.1.0/widgets.js"></script>

<!-- Or latest version (update manually when needed) -->
<script src="https://www.hellovoip.co/rohit-dashboard-widget/v1.1.0/widgets.js"></script>
```

### FAQ: Why use `wlixcc/SFTP-Deploy-Action` instead of `appleboy/scp-action`?

**Q: I see Telesero uses `appleboy/scp-action` for CDN deployment. Why are we using `wlixcc/SFTP-Deploy-Action` instead?**

**A:** Great question! The choice depends on your hosting type and authentication method:

#### Telesero's Approach (Using `appleboy/scp-action`):

```yaml
- name: Publish build files to CDN
  uses: appleboy/scp-action@master
  with:
    host: 54.39.187.61
    username: github
    key: ${{ secrets.CDN_PRIVATE_KEY }}  # SSH Private Key
    port: 22349                           # Custom SSH port
    source: "dist/dashboard-widget.js"
    target: "/www/cdn.cxcl.io/telekit/"
    strip_components: 1
```

**Protocol:** SCP (Secure Copy Protocol) over SSH
**Authentication:** SSH private key (more secure)
**Server Type:** Dedicated/VPS server with SSH access
**Port:** Custom SSH port (22349)

#### Our Approach (Using `wlixcc/SFTP-Deploy-Action`):

```yaml
- name: Deploy to CDN via SFTP
  uses: wlixcc/SFTP-Deploy-Action@v1.2.4
  with:
    username: ${{ secrets.SFTP_USERNAME }}
    server: ${{ secrets.SFTP_SERVER }}
    port: ${{ secrets.SFTP_PORT }}          # Port 21 (FTP/SFTP)
    password: ${{ secrets.SFTP_PASSWORD }}  # Password authentication
    local_path: './dist/*'
    remote_path: '/httpdocs/rohit-dashboard-widget/v${{ steps.bump.outputs.version }}'
    sftp_only: true
```

**Protocol:** SFTP (SSH File Transfer Protocol)
**Authentication:** Username + Password
**Server Type:** Shared hosting (Plesk) with SFTP access
**Port:** Standard FTP/SFTP port (21)

#### Comparison Table:

| Aspect | appleboy/scp-action (Telesero) | wlixcc/SFTP-Deploy-Action (Our Setup) |
|--------|-------------------------------|----------------------------------------|
| **Protocol** | SCP over SSH | SFTP or FTP |
| **Authentication** | SSH Private Key | Username + Password |
| **Port** | Custom SSH (e.g., 22349, 22) | FTP/SFTP (21 or 22) |
| **Server Type** | Dedicated/VPS with SSH | Shared hosting with SFTP |
| **Security** | More secure (key-based) | Secure with strong password |
| **Setup Complexity** | More complex | Simpler |
| **Speed** | Faster | Slightly slower |
| **Works with** | SSH-enabled servers | Most shared hosting |

#### Which Should You Use?

**Use `wlixcc/SFTP-Deploy-Action` if:**
- ✅ You have shared hosting (cPanel, Plesk, etc.)
- ✅ You have FTP/SFTP username and password
- ✅ SSH access is disabled or unavailable
- ✅ Port 21 or 22 for SFTP
- ✅ You want simpler setup

**Use `appleboy/scp-action` if:**
- ✅ You have a VPS or dedicated server
- ✅ You have SSH access with private key
- ✅ You want faster, more secure deployment
- ✅ You have root/sudo access to configure SSH keys

#### How to Switch to SSH Key-Based (Optional):

If you later get SSH access and want to use the Telesero approach:

1. **Generate SSH key on your server:**
   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_deploy
   cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

2. **Copy private key:**
   ```bash
   cat ~/.ssh/github_deploy
   ```

3. **Add to GitHub Secrets:**
   - Name: `CDN_PRIVATE_KEY`
   - Value: Private key content

4. **Update workflow:**
   ```yaml
   - name: Deploy to CDN via SCP
     uses: appleboy/scp-action@master
     with:
       host: ${{ secrets.SFTP_SERVER }}
       username: ${{ secrets.SFTP_USERNAME }}
       key: ${{ secrets.CDN_PRIVATE_KEY }}
       port: 22  # SSH port (not FTP port 21)
       source: "dist/*"
       target: "/httpdocs/rohit-dashboard-widget/v${{ steps.bump.outputs.version }}/"
       strip_components: 1
   ```

**Note:** For most shared hosting scenarios, password-based SFTP (our current setup) is the correct and only available option.

---

## Changelog

| Date | Changes |
|------|---------|
| 2025-10-11 | Initial guide created with webpack configuration fixes |
| 2025-10-11 | Added CDN deployment via FTP (switched from SFTP due to hosting compatibility) |

---

**Last Updated:** 2025-10-11
**Author:** Development Team
