# Dashboard Widget - Complete Setup Summary

## Problem Solved

✅ **Issue**: RequireJS error in Storybook: "Module name 'react' has not been loaded yet"

✅ **Root Cause**: The widget needs to support TWO loading methods:
- **Production (backoffice/crm)**: AMD/RequireJS from CDN
- **Development (Storybook)**: ES modules from npm

## Solution Implemented

### 1. Dashboard Widget Package (`rohit-dashboard-widget`)

#### Updated `package.json`
```json
{
  "main": "src/index.js",           // ES modules for development
  "module": "src/index.js",
  "browser": "dist/widgets.js",     // Standalone
  "exports": {
    ".": "./src/index.js",          // Default: ES modules
    "./amd": "./dist/dashboard-widget.js",    // AMD build
    "./standalone": "./dist/widgets.js"
  }
}
```

**Benefits:**
- Default imports use ES modules (works in Storybook)
- AMD build available for production
- Both builds included in published package

### 2. Application Frontend Framework

#### Updated `src/containers/Dashboard/index.js`

Implemented **dual-loading strategy**:

```javascript
// Check environment and load accordingly
if (window.teleseroAMD?.require) {
  // Production: Load via AMD from CDN
  window.teleseroAMD.require(["dashboard-widget"], (module) => {
    module.WidgetLoader({ /* config */ });
  });
} else {
  // Development: Load via ES modules
  import("@rohitcoding1991/rohit-dashboard-widget")
    .then((module) => {
      module.WidgetLoader({ /* config */ });
    });
}
```

**Benefits:**
- Works in production (AMD from CDN)
- Works in Storybook (ES modules from node_modules)
- No RequireJS errors
- No duplicate React

#### Updated `build-tools/index.ejs`

Added dashboard-widget to RequireJS config:

```ejs
paths: {
  "widget-base": "https://cdn.cxcl.io/telekit/widget-base-<%= widget_base_version %>",
  "dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-<%= dashboard_widget_version %>"
}
```

**Benefits:**
- Production apps automatically load dashboard-widget from CDN
- Same pattern as widget-base
- No manual configuration needed in backoffice/crm

## How It Works

### Production Flow (Backoffice/CRM)

```
1. index.html loads telesero-base.js from CDN
   └─> Contains React, styled-components (AMD wrapped)

2. RequireJS configured with paths:
   ├─> widget-base: CDN URL
   └─> dashboard-widget: CDN URL

3. Dashboard component detects window.teleseroAMD
   └─> Loads dashboard-widget via AMD
       └─> Uses React from telesero-base (no duplicates)
```

### Development Flow (Storybook)

```
1. Storybook starts with webpack bundler
   └─> No teleseroAMD available

2. Dashboard component detects no AMD
   └─> Falls back to ES module import
       └─> import("@rohitcoding1991/rohit-dashboard-widget")
           └─> Loads from node_modules
               └─> Webpack bundles dependencies
```

## Testing Status

### ✅ Storybook (Development)
- No RequireJS errors
- Widget loads via ES modules
- Console: "Loading dashboard widget via ES modules..."

### ⏳ Production (Pending CDN Upload)
- Need to upload `dist/dashboard-widget.js` to CDN
- Then test in backoffice/crm staging
- Expected: Widget loads via AMD from CDN

## Next Steps

### 1. Build and Publish Widget

```bash
cd rohit-dashboard-widget

# Build
npm run build

# Publish to GitHub Packages
npm version patch  # or 1.0.9
npm publish
```

### 2. Upload to CDN

```bash
# Upload dist/dashboard-widget.js to:
# https://cdn.cxcl.io/telekit/dashboard-widget-1.0.9.js

# Verify:
curl -I https://cdn.cxcl.io/telekit/dashboard-widget-1.0.9.js
```

### 3. Update Application Frontend Framework

```bash
cd application-frontend-framework

# Update widget version
npm install @rohitcoding1991/rohit-dashboard-widget@1.0.9

# Build and publish telekit
npm run dist
```

### 4. Deploy to Backoffice/CRM

```bash
cd backoffice-frontend

# Update telekit
npm install @telesero/telekit@latest

# Build
npm run build

# Verify index.html includes dashboard-widget CDN URL

# Deploy
npm run deploy:staging  # Test first!
npm run deploy:production  # After verification
```

### 5. Repeat for CRM

Same process as backoffice.

## Files Modified

### Dashboard Widget Repository
- ✅ `package.json` - Entry points and exports
- ✅ `CLAUDE.md` - Complete documentation
- ✅ `DEPLOYMENT.md` - Step-by-step deployment guide
- ✅ `SUMMARY.md` - This file

### Application Frontend Framework
- ✅ `src/containers/Dashboard/index.js` - Dual loading logic
- ✅ `build-tools/index.ejs` - RequireJS config

## Key Takeaways

1. **Dual Loading Pattern**: Support both AMD (production) and ES modules (development)
2. **Environment Detection**: Check for `window.teleseroAMD` to determine loading method
3. **CDN Deployment**: AMD build must be uploaded to CDN for production
4. **Shared Dependencies**: Production uses React from telesero-base (no duplicates)
5. **Development Flexibility**: ES modules work in Storybook without AMD setup

## Documentation

- **CLAUDE.md**: Complete architecture, usage, and troubleshooting
- **DEPLOYMENT.md**: Step-by-step deployment guide with verification
- **SUMMARY.md**: This overview
- **GITHUB_PACKAGES_INSTALL.md**: npm authentication instructions

## Support

For issues:
1. Check CLAUDE.md troubleshooting section
2. Review DEPLOYMENT.md for deployment issues
3. Verify dual-loading logic in Dashboard/index.js
4. Check CDN upload status
5. Test in both Storybook and production

## Success Criteria

- [x] Widget package configured for dual loading
- [x] Dashboard component uses dual loading logic
- [x] index.ejs configured for AMD loading
- [x] Documentation complete
- [ ] Widget uploaded to CDN (pending)
- [ ] Tested in backoffice staging (pending)
- [ ] Tested in CRM staging (pending)
- [ ] Deployed to production (pending)
