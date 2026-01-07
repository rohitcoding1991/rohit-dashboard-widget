# Widget Version Management System

## Overview

This document explains how widget versions are automatically detected and injected into the production builds for backoffice and CRM applications.

## The Problem You Caught

Initially, the index.ejs had:
```ejs
"dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-<%= dashboard_widget_version || '1.0.8' %>"
```

This had a **hardcoded fallback** (`'1.0.8'`), which means:
- ❌ Would always use 1.0.8 if `dashboard_widget_version` was undefined
- ❌ Wouldn't automatically pick up new versions
- ❌ Inconsistent with how widget-base and frontend-common work

## The Correct Implementation

### How widget-base and frontend-common Work

**File**: `application-frontend-framework/build-tools/preset.js`

```javascript
// Around line 234-238
const findVersion = require(resolve(
  "node_modules/@telesero/frontend-common/build-tools/find-version"
));
const commonLibVersion = findVersion("@telesero/frontend-common");
const widgetsVersion = findVersion("@telesero/widget-base");
```

**What `findVersion` does:**
1. Looks in `node_modules/@package-name/package.json`
2. Reads the `version` field
3. Returns the version string (e.g., "1.0.103")

**Then passes to template** (line 269):
```javascript
opts.templateParameters = {
  frontend_common_version: commonLibVersion,  // "1.0.195"
  widget_base_version: widgetsVersion,        // "1.0.103"
  // ... other params
};
```

### The Fix for dashboard-widget

**Step 1: Add version detection** (line 239):
```javascript
const dashboardWidgetVersion = findVersion("@rohitcoding1991/rohit-dashboard-widget");
```

**Step 2: Pass to template** (line 271):
```javascript
opts.templateParameters = {
  frontend_common_version: commonLibVersion,
  widget_base_version: widgetsVersion,
  dashboard_widget_version: dashboardWidgetVersion,  // ← Added
  // ... other params
};
```

**Step 3: Use in index.ejs** (line 194):
```ejs
"dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-<%= dashboard_widget_version %>"
```

## How It Works End-to-End

### Scenario: Updating dashboard-widget

**1. Developer updates dashboard-widget**
```bash
cd rohit-dashboard-widget
npm version patch  # 1.0.8 → 1.0.9
npm run build
# Upload dist/dashboard-widget.js to CDN as dashboard-widget-1.0.9.js
npm publish
```

**2. Backoffice/CRM installs new version**
```bash
cd backoffice-frontend
npm install @rohitcoding1991/rohit-dashboard-widget@1.0.9
```

This installs to:
```
node_modules/
└── @rohitcoding1991/
    └── rohit-dashboard-widget/
        └── package.json  ← Contains "version": "1.0.9"
```

**3. Build process reads version automatically**
```bash
npm run build
```

What happens:
```
1. Webpack runs with preset.js
2. preset.js calls findVersion("@rohitcoding1991/rohit-dashboard-widget")
3. findVersion reads node_modules/@rohitcoding1991/rohit-dashboard-widget/package.json
4. Returns "1.0.9"
5. Passes to HtmlWebpackPlugin with dashboard_widget_version: "1.0.9"
6. index.ejs renders with dashboard_widget_version = "1.0.9"
```

**4. Generated index.html**
```html
<script>
  require.config({
    paths: {
      "widget-base": "https://cdn.cxcl.io/telekit/widget-base-1.0.103",
      "dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-1.0.9"
    }
  });
</script>
```

✅ **Automatically uses the correct version!**

## The findVersion Utility

### Source Code

**File**: `frontend-common/build-tools/find-version.js`

```javascript
// Likely implementation (based on usage pattern)
const fs = require('fs');
const path = require('path');

module.exports = function findVersion(packageName) {
  try {
    const packagePath = path.resolve(
      'node_modules',
      packageName,
      'package.json'
    );
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.warn(`Warning: Could not find version for ${packageName}`);
    return '0.0.0';  // Fallback
  }
};
```

### Usage Pattern

```javascript
// All packages follow the same pattern
const frontendCommonVersion = findVersion("@telesero/frontend-common");
const widgetBaseVersion = findVersion("@telesero/widget-base");
const dashboardWidgetVersion = findVersion("@rohitcoding1991/rohit-dashboard-widget");

// Pass to template
templateParameters: {
  frontend_common_version: frontendCommonVersion,
  widget_base_version: widgetBaseVersion,
  dashboard_widget_version: dashboardWidgetVersion
}
```

## Why This Approach?

### Advantages

✅ **Automatic Version Sync**
- No manual version configuration
- Always matches installed package
- Reduces human error

✅ **Single Source of Truth**
- Version defined once (package.json)
- Read automatically at build time
- Consistent across all builds

✅ **Easy Updates**
- Just `npm install package@version`
- No config file changes
- Build automatically picks up new version

✅ **Works with Lock Files**
- package-lock.json / yarn.lock control exact versions
- Build reads from installed version
- Reproducible builds

### Comparison with Manual Configuration

❌ **Manual Approach** (what we almost did):
```javascript
// build.config.js
module.exports = {
  dashboard_widget_version: "1.0.8"  // Must update manually
};
```

Problems:
- Forgetting to update config after npm install
- Version mismatch between installed package and CDN URL
- Extra file to maintain

✅ **Automatic Approach** (what we implemented):
```javascript
// preset.js
const dashboardWidgetVersion = findVersion("@rohitcoding1991/rohit-dashboard-widget");
```

Benefits:
- Always correct
- No extra config files
- Self-documenting

## Version Mismatch Scenarios

### Scenario 1: Package Installed, CDN File Missing

```bash
# Installed version
node_modules/@rohitcoding1991/rohit-dashboard-widget/package.json → "1.0.9"

# Generated HTML
<script>require.config({ paths: { "dashboard-widget": "...dashboard-widget-1.0.9" } })</script>

# CDN Status
https://cdn.cxcl.io/telekit/dashboard-widget-1.0.9.js → 404 Not Found ❌
```

**Result**: Widget fails to load, 404 error in console

**Solution**: Upload dashboard-widget.js to CDN as dashboard-widget-1.0.9.js

### Scenario 2: CDN File Exists, Wrong Package Installed

```bash
# Installed version
node_modules/@rohitcoding1991/rohit-dashboard-widget/package.json → "1.0.7"

# Generated HTML
<script>require.config({ paths: { "dashboard-widget": "...dashboard-widget-1.0.7" } })</script>

# CDN Status
https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8.js → 200 OK (but not loaded)
https://cdn.cxcl.io/telekit/dashboard-widget-1.0.7.js → Maybe 404? ❌
```

**Result**: Loading old version or 404 error

**Solution**:
```bash
npm install @rohitcoding1991/rohit-dashboard-widget@1.0.8
npm run build
```

### Scenario 3: Development Uses Different Version

```bash
# Installed for development
node_modules/@rohitcoding1991/rohit-dashboard-widget/package.json → "1.0.9"

# Production CDN
https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8.js → 200 OK

# Build generates
<script>require.config({ paths: { "dashboard-widget": "...dashboard-widget-1.0.9" } })</script>
```

**Result**: Production tries to load 1.0.9 (which doesn't exist on CDN yet)

**Solution**:
1. Upload 1.0.9 to CDN first
2. Then deploy app
3. Or install 1.0.8 for build: `npm install @rohitcoding1991/rohit-dashboard-widget@1.0.8`

## Best Practices

### 1. Version Deployment Order

Always follow this order:

```
1. Build dashboard-widget
   cd rohit-dashboard-widget
   npm run build

2. Upload to CDN
   aws s3 cp dist/dashboard-widget.js \
     s3://cdn/telekit/dashboard-widget-1.0.9.js

3. Verify CDN
   curl -I https://cdn.cxcl.io/telekit/dashboard-widget-1.0.9.js
   # Must return 200 OK

4. Publish to npm (for development)
   npm publish

5. Update consuming app
   cd backoffice-frontend
   npm install @rohitcoding1991/rohit-dashboard-widget@1.0.9

6. Build & deploy app
   npm run build
   npm run deploy
```

### 2. Version Pinning

**In package.json**, use exact versions for widgets:

```json
{
  "dependencies": {
    "@rohitcoding1991/rohit-dashboard-widget": "1.0.9"  // ✅ Exact version
    // NOT: "^1.0.9" or "~1.0.9"
  }
}
```

**Why?**
- CDN URLs are immutable (dashboard-widget-1.0.9.js)
- Semver ranges could install 1.0.10, but CDN has 1.0.9
- Exact versions ensure CDN and npm match

### 3. Verification Script

Create a script to verify versions match:

```javascript
// scripts/verify-versions.js
const fs = require('fs');
const path = require('path');

function getInstalledVersion(packageName) {
  const pkgPath = path.join('node_modules', packageName, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return pkg.version;
}

async function checkCDN(packageName, version) {
  const url = `https://cdn.cxcl.io/telekit/${packageName}-${version}.js`;
  const response = await fetch(url, { method: 'HEAD' });
  return response.ok;
}

async function main() {
  const widgets = [
    { name: 'widget-base', pkg: '@telesero/widget-base' },
    { name: 'dashboard-widget', pkg: '@rohitcoding1991/rohit-dashboard-widget' }
  ];

  for (const widget of widgets) {
    const version = getInstalledVersion(widget.pkg);
    const exists = await checkCDN(widget.name, version);

    console.log(`${widget.name}@${version}: ${exists ? '✅' : '❌ NOT ON CDN'}`);

    if (!exists) {
      console.error(`ERROR: ${widget.name}-${version}.js not found on CDN!`);
      process.exit(1);
    }
  }

  console.log('✅ All widget versions available on CDN');
}

main();
```

**Usage**:
```json
{
  "scripts": {
    "verify-versions": "node scripts/verify-versions.js",
    "prebuild": "npm run verify-versions"
  }
}
```

### 4. Lock File Commits

Always commit lock files:

```bash
git add package-lock.json  # or yarn.lock
git commit -m "Update dashboard-widget to 1.0.9"
```

**Why?**
- Ensures reproducible builds
- CI/CD installs exact same versions
- Team members get same versions

## Troubleshooting

### Issue: "Cannot find module '@rohitcoding1991/rohit-dashboard-widget'"

**During build:**
```
Error: Cannot resolve '@rohitcoding1991/rohit-dashboard-widget/package.json'
```

**Cause**: Package not installed

**Solution**:
```bash
npm install @rohitcoding1991/rohit-dashboard-widget
```

### Issue: Generated HTML has undefined version

**Generated HTML:**
```html
"dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-undefined"
```

**Cause**: `findVersion()` returned undefined (package not found)

**Solution**:
1. Check package is installed: `ls node_modules/@rohitcoding1991/`
2. Check preset.js syntax: variable name matches
3. Rebuild with verbose logging

### Issue: Different versions in dev vs prod

**Development**: Works fine in Storybook
**Production**: Widget fails to load

**Cause**:
- Dev uses ES modules from node_modules (any version)
- Prod uses AMD from CDN (specific version)
- Versions don't match

**Solution**:
1. Check installed version: `npm list @rohitcoding1991/rohit-dashboard-widget`
2. Check CDN: `curl -I https://cdn.cxcl.io/telekit/dashboard-widget-{version}.js`
3. Upload missing version to CDN or install correct version

## Summary

### Key Takeaways

1. ✅ **Version Detection is Automatic**
   - `findVersion()` reads from installed package
   - No manual configuration needed
   - Same pattern as widget-base and frontend-common

2. ✅ **Order Matters**
   - Upload to CDN first
   - Then install in app
   - Then build and deploy

3. ✅ **Use Exact Versions**
   - Pin widget versions in package.json
   - Ensures CDN and npm match
   - Prevents surprises

4. ✅ **Verify Before Deploy**
   - Check CDN availability
   - Test generated HTML
   - Verify version URLs

### Architecture Consistency

The dashboard-widget now follows the **exact same pattern** as widget-base:

| Step | widget-base | dashboard-widget |
|------|-------------|------------------|
| **Detect Version** | `findVersion("@telesero/widget-base")` | `findVersion("@rohitcoding1991/rohit-dashboard-widget")` |
| **Pass to Template** | `widget_base_version: widgetsVersion` | `dashboard_widget_version: dashboardWidgetVersion` |
| **Use in HTML** | `widget-base-<%= widget_base_version %>` | `dashboard-widget-<%= dashboard_widget_version %>` |
| **CDN Upload** | Upload as `widget-base-{version}.js` | Upload as `dashboard-widget-{version}.js` |

This consistency makes the system:
- Easier to understand
- Easier to maintain
- Easier to debug
- Easier to extend (adding more widgets)

---

**Credit**: This improvement was caught during code review. The automatic version detection pattern was already in use for widget-base and frontend-common, but was initially missed for dashboard-widget.
