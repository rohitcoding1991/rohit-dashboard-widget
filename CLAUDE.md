# Dashboard Widget - Technical Documentation

## Overview

`@rohitcoding1991/rohit-dashboard-widget` is a React-based dashboard widget library that supports two loading methods:
1. **ES Module Import** - For modern bundlers (webpack, vite, etc.)
2. **AMD/RequireJS** - For legacy applications using AMD module system

## Package Information

- **Package Name**: `@rohitcoding1991/rohit-dashboard-widget`
- **Registry**: GitHub Packages (`https://npm.pkg.github.com`)
- **Current Version**: 1.0.7
- **License**: Proprietary

## Installation

### Prerequisites

1. Configure npm to use GitHub Packages for the `@rohitcoding1991` scope:

```bash
# Create/edit ~/.npmrc
echo "@rohitcoding1991:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

2. Authenticate with GitHub Packages (requires a GitHub Personal Access Token with `read:packages` scope):

```bash
npm login --registry=https://npm.pkg.github.com --scope=@rohitcoding1991
```

### Install the Package

```bash
npm install @rohitcoding1991/rohit-dashboard-widget
```

Or with yarn:

```bash
yarn add @rohitcoding1991/rohit-dashboard-widget
```

## Usage Methods

### Method 1: AMD/RequireJS (Production - Backoffice/CRM)

This is the **PRIMARY** method used in production environments (backoffice-frontend, crm-frontend).

The widget is loaded from CDN via AMD/RequireJS after `telesero-base` is loaded:

```javascript
// Automatically configured in index.ejs
require.config({
  paths: {
    "dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8"
  }
});

// Load and initialize the widget
require(["dashboard-widget"], function(dashboardWidget) {
  dashboardWidget.WidgetLoader({
    containerId: "dashboard-widget-container",
    config: {
      advertisedPages: [
        { id: "page1", name: "Page 1" }
      ]
    },
    onLoad: function() {
      console.log("Widget loaded successfully!");
    },
    onError: function(error) {
      console.error("Widget failed to load:", error);
    }
  });
});
```

**How it works in production:**
1. `index.ejs` loads `telesero-base.js` from CDN (contains React, styled-components)
2. `index.ejs` configures RequireJS paths to load `dashboard-widget` from CDN
3. Application code uses `window.teleseroAMD.require(["dashboard-widget"])` to load the widget
4. Widget uses dependencies from `telesero-base` (no duplicate React)

### Method 2: ES Module Import (Development - Storybook/Testing)

Use this method for local development, Storybook, and testing.

```javascript
import { WidgetLoader, api, Widget } from "@rohitcoding1991/rohit-dashboard-widget";

// Initialize the widget
WidgetLoader({
  containerId: "dashboard-widget-container",
  config: {
    advertisedPages: [
      { id: "page1", name: "Page 1" },
      { id: "page2", name: "Page 2" }
    ]
  },
  onLoad: () => {
    console.log("Widget loaded successfully!");
  },
  onError: (error) => {
    console.error("Widget failed to load:", error);
  }
});
```

**Available Named Exports:**
- `WidgetLoader` - Main function to initialize the dashboard widget
- `api` - API object containing `DashboardLoader` (alias for `WidgetLoader`)
- `Widget` - The raw React component for advanced usage

### Method 3: Dual Loading (Recommended for application-frontend-framework)

For `application-frontend-framework` (telekit), use this pattern to support both AMD (production) and ES modules (development):

```javascript
import React from "react";

const Dashboard = () => {
  React.useEffect(() => {
    // Check if AMD environment is available (production)
    if (typeof window.teleseroAMD !== "undefined" && window.teleseroAMD.require) {
      // Production: Load via AMD
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
  }, []);

  return <div id="dashboard-widget-container" />;
};
```

This pattern ensures:
- **Production (backoffice/crm)**: Uses AMD from CDN, shares React from telesero-base
- **Development (Storybook)**: Uses ES modules from node_modules, works without AMD

### Method 4: Standalone (Direct Script Tag)

The standalone build (`dist/widgets.js`) also exposes a global helper:

```html
<script src="path/to/dist/widgets.js"></script>
<script>
  window.TeleseroWidgetLoader({
    containerId: "dashboard-widget-container",
    config: { /* your config */ }
  });
</script>
```

## Configuration Options

### WidgetLoader Options

```typescript
interface WidgetLoaderOptions {
  // ID of the DOM element where the widget will be rendered
  containerId?: string; // Default: "dashboard-widget-container"

  // Configuration object passed to the widget
  config?: {
    advertisedPages?: Array<{
      id: string;
      name: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };

  // Callback fired when widget loads successfully
  onLoad?: () => void;

  // Callback fired when widget fails to load
  onError?: (error: Error) => void;
}
```

### HTML Setup

Ensure you have a container element in your HTML:

```html
<div id="dashboard-widget-container"></div>
```

## Build System

This package uses a dual-build system powered by Neutrino and webpack:

### Build Process

```bash
# Production build
npm run build

# Debug build (unminified)
npm run build:debug
```

### Build Output

The build process generates the following files in the `dist/` directory:

- `dashboard-widget.js` - AMD-compatible widget bundle (591KB)
- `telesero-base.js` - Base dependencies bundle (1.06MB)
- `widgets.js` - Standalone concatenated file with global helper (1.65MB)
- `*.json` - Asset manifests for AMD loading
- `bundle-stats.html` - Bundle analysis report

### Build Steps

1. **Webpack Build**: Compiles React/JSX code with Babel
   - Targets IE11+ browsers
   - Transpiles ES6+ to ES5
   - Handles styled-components and Material-UI

2. **RequireJS Optimization**: Creates AMD-compatible modules
   - Wraps output in AMD module format
   - Minifies with UglifyJS (in production mode)
   - Generates dependency manifests

3. **Standalone Preparation**: Concatenates files
   - Combines `telesero-base.js` + `dashboard-widget.js` + helpers
   - Creates `widgets.js` with global `TeleseroWidgetLoader`

## Architecture Overview

### Production Architecture (Backoffice/CRM)

```
┌─────────────────────────────────────────────────────────────┐
│ Backoffice/CRM Frontend                                     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ index.ejs (Generated from application-frontend-      │  │
│  │             framework/build-tools/index.ejs)         │  │
│  │                                                       │  │
│  │  1. Loads telesero-base.js from CDN                  │  │
│  │     - Contains: React, ReactDOM, styled-components   │  │
│  │     - Wrapped in AMD (window.teleseroAMD)           │  │
│  │                                                       │  │
│  │  2. Configures RequireJS paths:                      │  │
│  │     - widget-base -> CDN                             │  │
│  │     - dashboard-widget -> CDN                        │  │
│  │                                                       │  │
│  │  3. Loads widget-base via AMD                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Application Code (from application-frontend-         │  │
│  │                   framework)                          │  │
│  │                                                       │  │
│  │  Dashboard Component:                                 │  │
│  │    - Detects window.teleseroAMD                      │  │
│  │    - Loads dashboard-widget via AMD                  │  │
│  │    - Shares React from telesero-base                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Development Architecture (Storybook/Local)

```
┌─────────────────────────────────────────────────────────────┐
│ Application Frontend Framework (Local Development)         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Storybook / Development Server                        │  │
│  │                                                       │  │
│  │  - No teleseroAMD available                          │  │
│  │  - Uses webpack/bundler for dependencies             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Dashboard Component:                                  │  │
│  │    - Detects no AMD environment                      │  │
│  │    - Falls back to ES module import                  │  │
│  │    - Loads from node_modules                         │  │
│  │      @rohitcoding1991/rohit-dashboard-widget          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ Dashboard Widget Repository                                 │
│  (rohit-dashboard-widget)                               │
│                                                             │
│  1. npm run build                                          │
│     ├─> webpack (ES → AMD)                                 │
│     ├─> requirejs optimizer                                │
│     └─> Creates dist/dashboard-widget.js                   │
│                                                             │
│  2. Publish to GitHub Packages (for development)           │
│     npm publish                                            │
│                                                             │
│  3. Upload to CDN (for production)                         │
│     dist/dashboard-widget.js →                             │
│       https://cdn.cxcl.io/telekit/                         │
│         dashboard-widget-{version}.js                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Application Frontend Framework                              │
│  (application-frontend-framework)                          │
│                                                             │
│  1. Update build-tools/index.ejs                           │
│     - Add dashboard-widget version                         │
│     - Configure RequireJS path                             │
│                                                             │
│  2. Dashboard component uses dual loading:                 │
│     - Production: AMD from CDN                             │
│     - Development: ES modules from node_modules            │
│                                                             │
│  3. Build telekit package                                  │
│     npm run dist                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Backoffice/CRM Frontend                                     │
│                                                             │
│  1. Install updated telekit:                               │
│     npm install @telesero/telekit@latest                   │
│                                                             │
│  2. Build generates index.html with:                       │
│     - telesero-base from CDN                               │
│     - widget-base from CDN                                 │
│     - dashboard-widget from CDN                            │
│                                                             │
│  3. Deploy to production                                   │
└─────────────────────────────────────────────────────────────┘
```

## Architecture

### File Structure

```
rohit-dashboard-widget/
├── src/
│   ├── index.js              # Main entry point (ES modules)
│   ├── Widget.js             # Core widget component
│   ├── store/
│   │   └── advertised-pages.js
│   └── components/           # Additional components
├── dist/                     # Build output (AMD/standalone)
│   ├── dashboard-widget.js   # AMD module
│   ├── telesero-base.js      # Shared dependencies
│   └── widgets.js            # Standalone bundle
├── build/                    # Intermediate build artifacts
├── .neutrinorc.js            # Neutrino configuration
├── webpack.config.js         # Webpack configuration
├── requirejs.build.js        # RequireJS build config
└── package.json              # Package metadata
```

### Technology Stack

- **Framework**: React 16.14.0
- **UI Library**: Material-UI v4
- **Styling**: styled-components 5.2.1
- **Build Tools**:
  - Neutrino 9.4.0
  - webpack 4.44.2
  - RequireJS 2.3.6
- **State Management**: react-hooks-global-state
- **Grid System**: react-grid-layout
- **Date Handling**: Luxon

### Dependencies

**Core Dependencies:**
- `@telesero/frontend-common` - Shared frontend utilities
- `@telesero/widget-base` - Base widget functionality
- `react` & `react-dom` - UI framework
- `@material-ui/core`, `@material-ui/icons`, `@material-ui/lab` - UI components
- `styled-components` - CSS-in-JS styling
- `react-grid-layout` - Draggable grid layout
- `luxon` - Date/time handling

### Babel Configuration

The build targets IE11+ with the following transformations:
- ES6+ to ES5 transpilation
- Object rest/spread syntax
- JSX transformation
- Runtime helpers via `@babel/plugin-transform-runtime`

## Entry Points

The package provides multiple entry points for different use cases:

```json
{
  "main": "src/index.js",                // Primary entry (ES modules)
  "module": "src/index.js",              // ES modules (source)
  "browser": "dist/widgets.js",          // Standalone browser build
  "types": "src/index.d.ts",             // TypeScript definitions
  "exports": {
    ".": {
      "import": "./src/index.js",        // ES import
      "require": "./src/index.js",       // CommonJS require
      "default": "./src/index.js"        // Default fallback
    },
    "./dist/*": "./dist/*",              // Access dist files directly
    "./amd": "./dist/dashboard-widget.js",    // AMD module
    "./standalone": "./dist/widgets.js"       // Standalone bundle
  }
}
```

**Entry Point Usage:**
- **Default import** (`import from "@rohitcoding1991/rohit-dashboard-widget"`): Uses `src/index.js` (ES modules)
- **AMD/RequireJS**: Import via `require(["dashboard-widget"])` or use `@rohitcoding1991/rohit-dashboard-widget/amd`
- **Standalone browser**: Use `@rohitcoding1991/rohit-dashboard-widget/standalone` or `dist/widgets.js`
- **Direct dist access**: Import specific dist files via `@rohitcoding1991/rohit-dashboard-widget/dist/...`

## Publishing

The package needs to be published in TWO places for different use cases:

### 1. GitHub Packages (for development/npm install)

```bash
# Ensure you're authenticated to GitHub Packages
npm login --registry=https://npm.pkg.github.com --scope=@rohitcoding1991

# Build and publish
npm run build
npm publish
```

**Note**: The `files` field in package.json controls what gets published:
- `dist/` - Pre-built AMD modules
- `src/` - Source files for ES module imports

### 2. CDN Deployment (for production AMD loading)

The `dist/dashboard-widget.js` file needs to be uploaded to your CDN:

```bash
# After building
npm run build

# Upload to CDN (example using your CDN process)
# Upload: dist/dashboard-widget.js
# To: https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8.js
```

**Important**: The AMD build (`dist/dashboard-widget.js`) is wrapped in AMD format and depends on:
- `telesero-base` (provides React, styled-components, Material-UI)
- These dependencies are loaded via RequireJS in production

## Common Issues & Troubleshooting

### Issue: Widget container not found

```
Error: Container element with ID "dashboard-widget-container" not found
```

**Solution**: Ensure the container element exists in your HTML before calling `WidgetLoader`.

```html
<div id="dashboard-widget-container"></div>
```

### Issue: Module not found when importing

```
Error: Cannot find module '@rohitcoding1991/rohit-dashboard-widget'
```

**Solution**:
1. Verify your `.npmrc` has the GitHub Packages registry configured
2. Authenticate with GitHub Packages
3. Reinstall the package

### Issue: Importing `__esModule` or wrong exports

```
import { __esModule } from "@rohitcoding1991/rohit-dashboard-widget";
// Getting dist/dashboard-widget.js instead of src/index.js
```

**Solution**: This was fixed in the package configuration. The bundler was resolving to the AMD build instead of the source. The fix:
1. Changed `"main"` from `"dist/dashboard-widget.js"` to `"src/index.js"`
2. Added `"exports"` field to explicitly map import paths
3. Set `"browser"` field to `"dist/widgets.js"` for standalone usage

**After the fix, you need to:**
1. Rebuild and republish the widget package (bump version to 1.0.8+)
2. Update the widget in your consuming application: `npm install @rohitcoding1991/rohit-dashboard-widget@latest`
3. Clear your bundler cache if needed

### Issue: RequireJS cannot load module

```
Error: Load timeout for modules: dashboard-widget
```

**Solution**:
1. Ensure `dist/widgets.js` is included in your page
2. Verify the AMD module path is correctly configured
3. Check browser console for 404 errors

### Issue: Styled-components conflicts

If you see styled-components version conflicts:

**Solution**: The package uses resolutions to lock styled-components to v5.2.1. Ensure your parent project doesn't force a different version.

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Run development build
npm run build:debug

# Watch for changes (requires additional setup)
# Add to package.json scripts:
# "dev": "webpack --mode development --watch"
```

### Testing Integration

**In a modern React app:**

```javascript
import { WidgetLoader } from "@rohitcoding1991/rohit-dashboard-widget";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    WidgetLoader({
      containerId: "dashboard-widget-container",
      config: { /* your config */ }
    });
  }, []);

  return <div id="dashboard-widget-container" />;
}
```

**In a legacy app with RequireJS:**

```html
<!DOCTYPE html>
<html>
<head>
  <script src="path/to/require.js"></script>
</head>
<body>
  <div id="dashboard-widget-container"></div>

  <script>
    requirejs.config({
      paths: {
        'dashboard-widget': 'path/to/dist/dashboard-widget'
      }
    });

    require(['dashboard-widget'], function(widget) {
      widget.WidgetLoader({
        containerId: 'dashboard-widget-container'
      });
    });
  </script>
</body>
</html>
```

## Performance Considerations

### Bundle Sizes

- `dashboard-widget.js`: ~591KB (minified)
- `telesero-base.js`: ~1.06MB (shared dependencies)
- `widgets.js`: ~1.65MB (everything included)

### Optimization Tips

1. **For ES Module imports**: Your bundler can tree-shake unused code
2. **For AMD**: Load only required modules, don't use `widgets.js` unless necessary
3. **Consider code splitting**: Load the widget on-demand rather than upfront
4. **Enable gzip**: The build outputs compress well with gzip

### Browser Support

```json
[
  ">1%",
  "not dead",
  "not op_mini all",
  "last 2 version",
  "not ie 11",
  "not ie_mob 11"
]
```

Note: Despite IE11 being excluded from browserslist, the build is configured to support IE11 via Babel transpilation.

## API Reference

### WidgetLoader(options)

Main function to initialize and render the dashboard widget.

**Parameters:**
- `options` (Object) - Configuration options (see Configuration Options section)

**Returns:** `void`

**Throws:** Error if container element is not found

**Example:**
```javascript
WidgetLoader({
  containerId: "my-container",
  config: {
    advertisedPages: [...]
  },
  onLoad: () => console.log("Loaded!"),
  onError: (err) => console.error(err)
});
```

### api.DashboardLoader(options)

Alias for `WidgetLoader`. Provided for consistency with widget-base pattern.

### Widget Component

The raw React component exported for advanced usage.

**Props:**
- `config` (Object) - Widget configuration

**Example:**
```javascript
import { Widget } from "@rohitcoding1991/rohit-dashboard-widget";
import ReactDOM from "react-dom";

ReactDOM.render(
  <Widget config={{ advertisedPages: [...] }} />,
  document.getElementById("container")
);
```

## Support & Contribution

For issues, questions, or contributions:

1. Check the existing documentation in `/docs`
2. Review the source code in `/src`
3. Contact the repository maintainers

## Version History

- **v1.0.7** (Current) - Latest stable release
- **v1.0.6** - REACT_APP_API issue fix
- Previous versions - See git history

## License

Proprietary - All rights reserved.
