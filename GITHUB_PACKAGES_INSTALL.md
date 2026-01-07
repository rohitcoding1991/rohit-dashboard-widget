# Installing from GitHub Packages

This guide shows you how to install `@rohitcoding1991/rohit-dashboard-widget` from GitHub Packages.

## Prerequisites

You need a GitHub Personal Access Token (PAT) with the `read:packages` scope.

### Creating a GitHub Token

1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name (e.g., "GitHub Packages Read")
4. Select scopes:
   - ✅ `read:packages` - Download packages from GitHub Packages
5. Click **Generate token**
6. **Copy the token** - you won't see it again!

---

## Installation Steps

### Step 1: Configure NPM Registry

Create or update `.npmrc` in your project root:

```bash
# .npmrc
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
@rohitcoding1991:registry=https://npm.pkg.github.com
```

**Replace `YOUR_GITHUB_TOKEN`** with your actual token.

### Step 2: Install the Package

```bash
# Using yarn
yarn add @rohitcoding1991/rohit-dashboard-widget

# Using npm
npm install @rohitcoding1991/rohit-dashboard-widget
```

### Step 3: Import and Use

```javascript
import { Widget, WidgetLoader } from '@rohitcoding1991/rohit-dashboard-widget';

function App() {
  return (
    <div>
      <Widget config={{ advertisedPages: ['dashboard'] }} />
    </div>
  );
}
```

---

## Alternative: Using Environment Variable

For better security, use an environment variable instead of hardcoding the token:

### Step 1: Create `.npmrc` with placeholder

```bash
# .npmrc
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@rohitcoding1991:registry=https://npm.pkg.github.com
```

### Step 2: Set Environment Variable

**Linux/Mac:**
```bash
export GITHUB_TOKEN=your_github_token_here
```

**Windows (PowerShell):**
```powershell
$env:GITHUB_TOKEN="your_github_token_here"
```

**Windows (CMD):**
```cmd
set GITHUB_TOKEN=your_github_token_here
```

### Step 3: Install

```bash
yarn install
```

---

## For CI/CD (GitHub Actions)

Add the token as a GitHub Secret and use it in your workflow:

```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: 20
    registry-url: https://npm.pkg.github.com
    scope: '@rohitcoding1991'

- name: Install dependencies
  run: yarn install
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Troubleshooting

### Error: 401 Unauthorized

**Cause:** Invalid or missing GitHub token

**Solution:**
- Verify your token is correct
- Ensure token has `read:packages` scope
- Check that `.npmrc` is in the project root

### Error: 404 Not Found

**Cause:** Package not published or incorrect scope

**Solution:**
- Verify the package exists: https://github.com/rohitcoding1991/rohit-dashboard-widget/packages
- Check package name is exactly `@rohitcoding1991/rohit-dashboard-widget`
- Ensure registry is set for `@rohitcoding1991` scope

### Error: Unable to authenticate

**Cause:** Token expired or revoked

**Solution:**
- Generate a new token
- Update `.npmrc` with new token

---

## Complete `.npmrc` Example (With Telesero)

If you're also using Telesero packages:

```bash
# GitHub Packages for @rohitcoding1991 scope
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@rohitcoding1991:registry=https://npm.pkg.github.com

# Telesero private registry
//repo.npm.systems.cxcl.io/:_authToken="${TELESERO_NPM_TOKEN}"
@telesero:registry=https://repo.npm.systems.cxcl.io/

# Yarn registry configuration
email=automation@telesero.com
username=automation
strict-ssl=false
```

---

## Security Best Practices

1. ✅ **Never commit `.npmrc` with real tokens to git**
2. ✅ Use environment variables for tokens
3. ✅ Add `.npmrc` to `.gitignore`
4. ✅ Create `.npmrc.example` for team reference
5. ✅ Use minimal token scopes (only `read:packages`)
6. ✅ Rotate tokens periodically

---

## Verifying Installation

After installation, verify the package is installed:

```bash
# Check installed version
yarn list @rohitcoding1991/rohit-dashboard-widget

# Or with npm
npm list @rohitcoding1991/rohit-dashboard-widget
```

You should see the package version listed.

---

## Available Versions

View all published versions:
- https://github.com/rohitcoding1991/rohit-dashboard-widget/packages

Install specific version:
```bash
yarn add @rohitcoding1991/rohit-dashboard-widget@1.0.2
```

---

## Need Help?

- Package Repository: https://github.com/rohitcoding1991/rohit-dashboard-widget
- Issues: https://github.com/rohitcoding1991/rohit-dashboard-widget/issues
- Releases: https://github.com/rohitcoding1991/rohit-dashboard-widget/releases
