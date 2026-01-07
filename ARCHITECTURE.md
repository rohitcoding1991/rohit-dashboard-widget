# Telesero Widget Ecosystem - Complete Architecture Guide

## Table of Contents
1. [Overview](#overview)
2. [The Base Layer: telesero-base (frontend-common)](#the-base-layer-telesero-base-frontend-common)
3. [The Widget Layer: widget-base](#the-widget-layer-widget-base)
4. [The Framework Layer: application-frontend-framework (telekit)](#the-framework-layer-application-frontend-framework-telekit)
5. [The Application Layer: backoffice-frontend & crm-frontend](#the-application-layer-backoffice-frontend--crm-frontend)
6. [Loading Sequence & Runtime Behavior](#loading-sequence--runtime-behavior)
7. [Why AMD & CDN? (vs Modern Approaches)](#why-amd--cdn-vs-modern-approaches)
8. [Adding New Widgets](#adding-new-widgets)
9. [Troubleshooting Guide](#troubleshooting-guide)

---

## Overview

### The Ecosystem Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CDN Layer                                   │
│  https://cdn.cxcl.io/telekit/                                       │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ telesero-base.js │  │ widget-base.js   │  │dashboard-widget  │ │
│  │ (1.0.195)        │  │ (1.0.103)        │  │.js (1.0.8)       │ │
│  │                  │  │                  │  │                  │ │
│  │ - React 16.14    │  │ - WidgetLoader   │  │ - Dashboard UI   │ │
│  │ - ReactDOM       │  │ - Widget Dock    │  │ - Grid Layout    │ │
│  │ - styled-comp    │  │ - Base Widgets   │  │ - Components     │ │
│  │ - Material-UI    │  │                  │  │                  │ │
│  │ - Luxon          │  │ Uses ────────────┼──> Uses telesero-  │ │
│  │ - (AMD wrapped)  │  │ telesero-base    │  │  base deps       │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Loaded via <script> tags
                                  │ and RequireJS
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   Source Repositories                               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ frontend-common (Builds to → telesero-base.js)              │  │
│  │                                                              │  │
│  │  Purpose: Shared dependencies for all widgets               │  │
│  │  Build: Webpack → AMD bundle                                │  │
│  │  Output: dist/telesero-base.js                              │  │
│  │  Deploy: Upload to CDN                                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                  │                                  │
│                                  ▼                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ widget-base (Builds to → widget-base.js)                    │  │
│  │                                                              │  │
│  │  Purpose: Base widget system & dock                         │  │
│  │  Build: Webpack → AMD bundle                                │  │
│  │  Externals: React, styled-components (from telesero-base)   │  │
│  │  Output: dist/widget-base.js                                │  │
│  │  Deploy: Upload to CDN                                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                  │                                  │
│                                  ▼                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ rohit-dashboard-widget (Builds to → dashboard-widget.js) │  │
│  │                                                              │  │
│  │  Purpose: Dashboard widget with grid layout                 │  │
│  │  Build: Webpack → AMD bundle                                │  │
│  │  Externals: React, styled-components, telesero-base         │  │
│  │  Output: dist/dashboard-widget.js                           │  │
│  │  Deploy: Upload to CDN + npm publish                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                  │                                  │
│                                  ▼                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ application-frontend-framework (telekit)                    │  │
│  │                                                              │  │
│  │  Purpose: Reusable UI components & widget integration       │  │
│  │  Build: Babel → ES5 for consumption by apps                 │  │
│  │  Includes: Dashboard component with dual-loading            │  │
│  │  Output: Published as @telesero/telekit to npm              │  │
│  │  Contains: build-tools/index.ejs template                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                  │                                  │
│                                  ▼                                  │
│  ┌────────────────────────┐  ┌────────────────────────┐           │
│  │ backoffice-frontend    │  │ crm-frontend           │           │
│  │                        │  │                        │           │
│  │  Uses: @telesero/      │  │  Uses: @telesero/      │           │
│  │        telekit         │  │        telekit         │           │
│  │                        │  │                        │           │
│  │  Build: Generates      │  │  Build: Generates      │           │
│  │         index.html     │  │         index.html     │           │
│  │         from index.ejs │  │         from index.ejs │           │
│  │                        │  │                        │           │
│  │  Loads: CDN scripts    │  │  Loads: CDN scripts    │           │
│  └────────────────────────┘  └────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## The Base Layer: telesero-base (frontend-common)

### What is frontend-common?

**Repository**: `/Users/amandeepkochhar/Desktop/netweb_workspace/connexio/frontend-common`

**Purpose**: The foundational layer that provides shared dependencies for the entire widget ecosystem. It bundles all common libraries (React, Material-UI, styled-components) into a single AMD module.

### Why Does It Exist?

**Problem it solves:**
- Multiple widgets (widget-base, dashboard-widget, future widgets) all need React, Material-UI, etc.
- Without this, each widget would bundle its own copy of React → 3 widgets = 3x React in the browser
- Result: Massive bundle sizes, memory waste, and React context conflicts

**Solution:**
- Bundle ALL shared dependencies into one file: `telesero-base.js`
- Upload to CDN once
- All widgets declare these as "externals" and use the CDN version
- Result: React loaded once, shared by all widgets ✅

### What's Inside telesero-base.js?

```javascript
// Core React
- react@16.14.0
- react-dom@16.14.0
- react-is

// Styling
- styled-components@5.2.1
- @material-ui/core@4.11.0
- @material-ui/icons@4.9.1
- @material-ui/lab@4.0.0-alpha.56
- @material-ui/styles@4.11.5
- @material-ui/pickers@3.2.10

// Utilities
- luxon@1.25.0 (date/time)
- prop-types
- clsx
- polished

// State Management
- react-hooks-global-state

// Other
- react-draggable
- react-window
- And more...
```

### How is telesero-base Built?

**Source**: `frontend-common/src/index.js`
```javascript
// Simple re-exports
export * as fonts from "./fonts";
export * as utils from "./utils";
export * as theme from "./theme";
// etc.
```

**Build Process**:
1. **Webpack Configuration** (`frontend-common/.neutrinorc.js`):
   ```javascript
   module.exports = {
     use: [
       amdPreset("telesero-base", {
         library: true
       })
     ]
   };
   ```

2. **Webpack builds with AMD target**:
   ```javascript
   output: {
     libraryTarget: "amd",
     library: "telesero-base"
   }
   ```

3. **Output**: `frontend-common/dist/telesero-base.js` (~1.06MB)
   ```javascript
   // Wrapped in AMD define()
   define("telesero-base", [], function() {
     return {
       react: React,
       "react-dom": ReactDOM,
       "styled-components": styledComponents,
       // ... all exports
     };
   });
   ```

4. **RequireJS Optimization**:
   ```javascript
   // Minifies, optimizes
   node node_modules/requirejs/bin/r.js -o requirejs.build.js
   ```

5. **Upload to CDN**:
   ```bash
   # Manual or automated
   aws s3 cp dist/telesero-base.js \
     s3://cdn-bucket/telekit/telesero-base-1.0.195.js
   ```

### Why Build to dist/ Folder?

**Q**: Why put dependencies in `dist/` instead of importing directly?

**A**: Multiple critical reasons:

1. **Version Control**:
   - `telesero-base-1.0.195.js` on CDN is immutable
   - Apps can upgrade when ready, not forced
   - Easy rollback if issues occur

2. **Build Optimization**:
   - Minification & compression (1.06MB → ~300KB gzipped)
   - Tree-shaking unused code
   - Production-ready bundle

3. **AMD Wrapping**:
   - Source code uses ES modules
   - Build process wraps in AMD `define()` for RequireJS
   - Production needs AMD format for CDN loading

4. **Deployment**:
   - Single file to upload
   - Cacheable by CDN (1 year cache headers)
   - Fast loading for end users

### What If CDN is Not Available?

**Current Architecture**:
- ⚠️ **Single Point of Failure**: If CDN is down, apps won't load
- No fallback mechanism implemented

**Possible Solutions** (not currently implemented):

```javascript
// Option 1: Fallback to alternate CDN
<script src="https://cdn.cxcl.io/telekit/telesero-base-1.0.195.js"
        onerror="this.src='https://cdn-backup.cxcl.io/telekit/telesero-base-1.0.195.js'">
</script>

// Option 2: Local fallback
<script>
  window.teleseroAMD || document.write(
    '<script src="/static/js/telesero-base-1.0.195.js"><\/script>'
  );
</script>

// Option 3: Service Worker caching
// Cache CDN assets in service worker for offline support
```

**Recommendations**:
1. Set up CDN monitoring/alerts
2. Implement fallback to backup CDN
3. Consider service worker for caching
4. Keep local copy for development

### Module Format: AMD

**Why AMD?**

```javascript
// AMD (Asynchronous Module Definition)
define("telesero-base", ["dependency"], function(dep) {
  return { exports };
});

// vs ES Modules
export { something };
```

**AMD Advantages for this architecture**:
1. **Runtime Loading**: Can load modules dynamically via RequireJS
2. **No Bundler Needed**: Browser can load directly via `<script>` tags
3. **Explicit Dependencies**: Define and require modules by name
4. **Version Flexibility**: Load specific versions from CDN

**AMD Disadvantages** (why modern apps avoid it):
1. More verbose syntax
2. Requires RequireJS runtime (~20KB)
3. Less tooling support vs ES modules
4. Not tree-shakeable

---

## The Widget Layer: widget-base

### What is widget-base?

**Repository**: `/Users/amandeepkochhar/Desktop/netweb_workspace/connexio/widget-base`

**Purpose**: Provides the base widget system including the widget dock, loader, and common widget components.

### What's Inside widget-base?

**Source**: `widget-base/src/index.js`
```javascript
export { default as WidgetLoader } from "./WidgetLoader";
export { WidgetThemeProvider } from "./WidgetThemeProvider";
export * as components from "./components";
export * as hooks from "./hooks";

export const api = {
  getWidget,
  getWidgetStore,
  setDockOpen,
  hasWidget
};
```

**Key Components**:
- **WidgetLoader**: Main function to initialize widgets
- **WidgetDock**: Sidebar that holds widget buttons
- **WidgetThemeProvider**: Theme context for widgets
- **Base Components**: Buttons, cards, modals used by widgets

### How is widget-base Built?

**Build Process**:

1. **Source**: Pure ES modules in `src/`
   ```javascript
   import React from "react";
   import { WidgetDock } from "./containers/WidgetDock";
   ```

2. **Webpack Configuration**:
   ```javascript
   // .neutrinorc.js
   module.exports = {
     use: [
       amdPreset("widget-base", {
         library: true
       }),
       neutrino => {
         // Mark dependencies as external (use from telesero-base)
         neutrino.config.externals({
           "react": "react",
           "react-dom": "react-dom",
           "styled-components": "styled-components",
           "@material-ui/core": ["telesero-base", "@material-ui/core"],
           // etc.
         });
       }
     ]
   };
   ```

3. **Build Output**: `dist/widget-base.js`
   ```javascript
   // AMD wrapper expecting externals
   define("widget-base", [
     "react",              // From telesero-base
     "styled-components",  // From telesero-base
     "telesero-base"      // Direct import
   ], function(React, styled, teleseroBase) {
     // Widget code here
     return { WidgetLoader, api, components };
   });
   ```

4. **Upload to CDN**: `https://cdn.cxcl.io/telekit/widget-base-1.0.103.js`

### AMD or ES Modules?

**widget-base uses BOTH**:

- **Source Code**: ES Modules (src/)
  ```javascript
  import React from "react";
  export { WidgetLoader };
  ```

- **Build Output**: AMD (dist/)
  ```javascript
  define("widget-base", ["react"], function(React) {
    // Built code
  });
  ```

- **Published Package**: Both!
  ```json
  {
    "main": "src/index.js",      // ES modules for development
    "module": "src/index.js",    // ES modules
    "browser": "dist/..."        // AMD for production
  }
  ```

**Why both?**
- Development (Storybook): Uses ES modules from `src/`
- Production (CDN): Uses AMD from `dist/`

### Relationship with telesero-base

```javascript
// widget-base webpack config
externals: {
  "react": "react",                    // Provided by RequireJS from telesero-base
  "styled-components": "styled-components",
  "@material-ui/core": ["telesero-base", "@material-ui/core"]
}
```

**At Runtime**:
1. Browser loads `telesero-base.js` → exposes `react`, `styled-components`, etc.
2. Browser loads `widget-base.js` → RequireJS sees `require(["react"])`
3. RequireJS provides React from telesero-base (already loaded)
4. No duplicate React ✅

---

## The Framework Layer: application-frontend-framework (telekit)

### What is application-frontend-framework?

**Repository**: `/Users/amandeepkochhar/Desktop/netweb_workspace/connexio/application-frontend-framework`

**Published as**: `@telesero/telekit` on npm

**Purpose**: A shared component library and framework used by backoffice-frontend and crm-frontend. It's the middle layer that:
1. Provides reusable UI components
2. Integrates widgets (widget-base, dashboard-widget)
3. Provides the build template (index.ejs)
4. Handles routing, auth, state management

### Why is it Separated?

**Q**: Why not put everything directly in backoffice/crm?

**A**: Code reuse and consistency:

```
WITHOUT telekit:
┌─────────────────┐  ┌─────────────────┐
│ backoffice      │  │ crm             │
│                 │  │                 │
│ - Login page    │  │ - Login page    │  ← Duplicate!
│ - User menu     │  │ - User menu     │  ← Duplicate!
│ - Data table    │  │ - Data table    │  ← Duplicate!
│ - Widget setup  │  │ - Widget setup  │  ← Duplicate!
└─────────────────┘  └─────────────────┘

WITH telekit:
┌──────────────────────────────┐
│ @telesero/telekit            │
│                              │
│ - Login component            │  ← Once
│ - User menu                  │  ← Once
│ - Data table                 │  ← Once
│ - Widget integration logic   │  ← Once
└──────────────────────────────┘
         │               │
         ▼               ▼
┌─────────────┐  ┌─────────────┐
│ backoffice  │  │ crm         │
│ (thin layer)│  │ (thin layer)│
│ - Routes    │  │ - Routes    │
│ - Config    │  │ - Config    │
└─────────────┘  └─────────────┘
```

**Benefits**:
1. **Single Source of Truth**: Components maintained in one place
2. **Consistency**: Backoffice and CRM look/behave the same
3. **Easier Updates**: Fix bug once, benefits all apps
4. **Faster Development**: New apps can bootstrap quickly

### What's Inside telekit?

**Structure**:
```
application-frontend-framework/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button/
│   │   ├── DataTable/
│   │   ├── UserMenu/
│   │   └── ...
│   ├── containers/       # Complex components
│   │   ├── Dashboard/    # ← Uses dashboard-widget!
│   │   ├── Login/
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Global state
│   ├── utils/           # Helper functions
│   └── index.js         # Main export
├── build-tools/
│   └── index.ejs        # ← HTML template for apps!
└── package.json
```

**Key File: build-tools/index.ejs**

This is the **HTML template** that backoffice/crm use to generate their `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title><%= product_name %></title>
</head>
<body>
  <div id="root"></div>

  <!-- Load telesero-base from CDN -->
  <script src="https://cdn.cxcl.io/telekit/telesero-base-<%= frontend_common_version %>.js"></script>

  <script>
    // Set up AMD environment
    var require = teleseroAMD.require;
    var define = teleseroAMD.define;

    // Configure RequireJS paths
    require.config({
      baseUrl: "<%= public_url %>",
      paths: {
        "widget-base": "https://cdn.cxcl.io/telekit/widget-base-<%= widget_base_version %>",
        "dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-<%= dashboard_widget_version %>"
      }
    });

    // Initialize widgets
    require(["widget-base"], function(widgets) {
      widgets.WidgetLoader({ /* config */ });
    });
  </script>
</body>
</html>
```

### How is telekit Built?

**Build Process**:

1. **Source**: ES modules with React components
2. **Build**: Babel transpilation (NOT webpack bundling!)
   ```bash
   # .neutrinorc.js uses Babel to transpile
   babel src/ --out-dir lib/
   ```

3. **Output**: Transpiled ES5 code (still as modules)
   ```javascript
   // lib/components/Button/index.js
   "use strict";
   Object.defineProperty(exports, "__esModule", { value: true });
   var React = require("react");
   // ES5 but not bundled
   ```

4. **Publish to npm**: `@telesero/telekit`
   ```json
   {
     "name": "@telesero/telekit",
     "main": "index.js",
     "files": ["lib", "build-tools", "src"]
   }
   ```

**Key Difference**:
- telesero-base/widget-base: Webpack → Single AMD bundle → CDN
- telekit: Babel → Individual files → npm → Consumed by apps

### How telekit Links to Widgets

**Dashboard Component** (`src/containers/Dashboard/index.js`):

```javascript
import React from "react";
import { useAdvertisedPages } from "../../store/advertisedPages";

const Dashboard = () => {
  React.useEffect(() => {
    // DUAL LOADING STRATEGY
    if (typeof window.teleseroAMD !== "undefined") {
      // Production: Load dashboard-widget via AMD
      window.teleseroAMD.require(["dashboard-widget"], (module) => {
        module.WidgetLoader({
          containerId: "dashboard-widget-container",
          config: { advertisedPages }
        });
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

**Why Dual Loading?**

| Environment | Method | Source |
|-------------|--------|--------|
| Production (backoffice/crm) | AMD | CDN (dashboard-widget.js) |
| Development (Storybook) | ES modules | node_modules |
| Integration Tests | ES modules | node_modules |

This allows:
- Production: Use optimized CDN bundle with shared React
- Development: Use source code from npm without AMD setup

---

## The Application Layer: backoffice-frontend & crm-frontend

### What are backoffice and CRM?

**Repositories**:
- `/Users/amandeepkochhar/Desktop/netweb_workspace/connexio/backoffice-frontend`
- `/Users/amandeepkochhar/Desktop/netweb_workspace/connexio/crm-frontend`

**Purpose**: End-user applications that provide business functionality.

**Relationship**:
```
backoffice/crm = Thin app layer + @telesero/telekit + Business logic
```

### What's in These Apps?

**Typical Structure**:
```
backoffice-frontend/
├── src/
│   ├── pages/           # App-specific pages
│   │   ├── Customers/
│   │   ├── Orders/
│   │   └── Reports/
│   ├── routes/          # App-specific routing
│   ├── config/          # App-specific config
│   └── index.js         # Entry point
├── public/
│   └── index.html       # Generated from telekit's index.ejs!
└── package.json
    └── dependencies:
        └── "@telesero/telekit": "^1.1.641"
```

### How Do They Use telekit?

**1. Install telekit**:
```json
// package.json
{
  "dependencies": {
    "@telesero/telekit": "^1.1.641"
  }
}
```

**2. Import components**:
```javascript
// src/pages/Dashboard.js
import { Dashboard, UserMenu, DataTable } from "@telesero/telekit";

function DashboardPage() {
  return (
    <div>
      <UserMenu />
      <Dashboard />  {/* ← This loads dashboard-widget! */}
    </div>
  );
}
```

**3. Use build template**:
```javascript
// webpack.config.js or build script
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: 'node_modules/@telesero/telekit/build-tools/index.ejs',
      templateParameters: {
        product_name: "Backoffice",
        frontend_common_version: "1.0.195",
        widget_base_version: "1.0.103",
        dashboard_widget_version: "1.0.8",
        // ... other vars
      }
    })
  ]
};
```

**4. Build generates index.html**:
```html
<!DOCTYPE html>
<html>
<head><title>Backoffice</title></head>
<body>
  <div id="root"></div>

  <!-- From template -->
  <script src="https://cdn.cxcl.io/telekit/telesero-base-1.0.195.js"></script>
  <script>
    var require = teleseroAMD.require;
    require.config({
      paths: {
        "widget-base": "https://cdn.cxcl.io/telekit/widget-base-1.0.103",
        "dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8"
      }
    });
  </script>

  <!-- App bundle -->
  <script src="/static/js/main.bundle.js"></script>
</body>
</html>
```

### Why Separate backoffice and CRM?

**Q**: Why not one big app?

**A**: Different business domains:

| App | Purpose | Users |
|-----|---------|-------|
| **Backoffice** | Internal operations | Admins, support staff |
| **CRM** | Customer management | Sales, account managers |

**Benefits of Separation**:
1. **Smaller Bundles**: Each app only loads its own code
2. **Independent Deployment**: Update CRM without touching backoffice
3. **Different Permissions**: Separate auth/access control
4. **Team Autonomy**: Different teams can work independently
5. **Performance**: Faster builds, smaller deploys

**Shared via telekit**:
- UI components
- Widget system
- Build configuration
- Common utilities

---

## Loading Sequence & Runtime Behavior

### Complete Loading Flow

Let's trace what happens when a user opens backoffice:

#### Step 1: Initial Page Load

```
User enters: https://backoffice.company.com
              ↓
Server returns: index.html (generated from index.ejs)
```

**index.html content**:
```html
<!DOCTYPE html>
<html>
<body>
  <div id="init-loader">Loading...</div>
  <div id="root"></div>

  <!-- Step 2: Load telesero-base -->
  <script src="https://cdn.cxcl.io/telekit/telesero-base-1.0.195.js"></script>

  <!-- Step 3: Configure AMD -->
  <script>
    var require = teleseroAMD.require;
    var define = teleseroAMD.define;

    require.config({
      baseUrl: "/",
      paths: {
        "widget-base": "https://cdn.cxcl.io/telekit/widget-base-1.0.103",
        "dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8"
      }
    });

    // Step 4: Preload widget-base
    require(["widget-base"], function(widgets) {
      widgets.WidgetLoader({ standalone: false });
    });
  </script>
</body>
</html>
```

#### Step 2: telesero-base.js Loads

```javascript
// Browser executes telesero-base.js

// 1. RequireJS loads
(function() {
  var requirejs, require, define;
  // RequireJS code...
})();

// 2. Expose as window.teleseroAMD
window.teleseroAMD = {
  require: require,
  define: define,
  requirejs: requirejs
};

// 3. Define telesero-base module
define("telesero-base", [], function() {
  return {
    react: React,
    "react-dom": ReactDOM,
    "styled-components": styledComponents,
    "@material-ui/core": MaterialUI,
    // ... all dependencies
  };
});

// 4. Configure module aliases
define("react", ["telesero-base"], function(base) {
  return base.react;
});
define("react-dom", ["telesero-base"], function(base) {
  return base["react-dom"];
});
// ... more aliases
```

**State after Step 2**:
- ✅ `window.teleseroAMD` exists
- ✅ RequireJS configured
- ✅ React, Material-UI available via AMD
- ✅ ~1.06MB loaded (cached for 1 year)

#### Step 3: AMD Configuration

```javascript
// index.html inline script
require.config({
  baseUrl: "/",
  paths: {
    // Tell RequireJS where to find these modules
    "widget-base": "https://cdn.cxcl.io/telekit/widget-base-1.0.103",
    "dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8"
  }
});
```

**State after Step 3**:
- ✅ RequireJS knows where to find widget-base
- ✅ RequireJS knows where to find dashboard-widget

#### Step 4: widget-base Preload

```javascript
// index.html inline script
require(["widget-base"], function(widgets) {
  // widget-base.js downloaded from CDN
  // RequireJS resolves dependencies (react, etc.) from telesero-base

  widgets.WidgetLoader({
    standalone: false,
    helpButtonFn: function(eventName, payload) {
      // Handle widget events
    }
  });
});
```

**What happens**:
1. RequireJS fetches `https://cdn.cxcl.io/telekit/widget-base-1.0.103.js`
2. widget-base.js executes:
   ```javascript
   define("widget-base", ["react", "styled-components"], function(React, styled) {
     // Widget dock code
     return { WidgetLoader, api };
   });
   ```
3. RequireJS provides `react` and `styled-components` from telesero-base
4. WidgetLoader initializes widget dock

**State after Step 4**:
- ✅ Widget dock initialized
- ✅ Widget buttons rendered (if configured)
- ✅ ~591KB loaded (widget-base)

#### Step 5: App Bundle Loads

```html
<!-- At end of index.html -->
<script src="/static/js/main.bundle.js"></script>
```

**What's in main.bundle.js**:
```javascript
// Bundled by webpack from backoffice-frontend/src/

// 1. React application code
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// 2. telekit components (from node_modules/@telesero/telekit)
import { Dashboard, UserMenu } from "@telesero/telekit";

// 3. App-specific pages
import CustomersPage from "./pages/Customers";
import OrdersPage from "./pages/Orders";

// 4. Initialize app
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
```

**State after Step 5**:
- ✅ React app mounted to `#root`
- ✅ Router initialized
- ✅ App UI visible

#### Step 6: User Navigates to Dashboard

```javascript
// User clicks "Dashboard" link
// Router renders <Dashboard /> component from telekit

// Dashboard component (from telekit):
const Dashboard = () => {
  React.useEffect(() => {
    // Detects AMD environment
    if (window.teleseroAMD) {
      // Load dashboard-widget via AMD
      window.teleseroAMD.require(["dashboard-widget"], (module) => {
        module.WidgetLoader({
          containerId: "dashboard-widget-container",
          config: { advertisedPages: [...] }
        });
      });
    }
  }, []);

  return <div id="dashboard-widget-container" />;
};
```

**What happens**:
1. RequireJS fetches `https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8.js`
2. dashboard-widget.js executes:
   ```javascript
   define("dashboard-widget", [
     "react",
     "styled-components",
     "telesero-base"
   ], function(React, styled, teleseroBase) {
     // Dashboard widget code
     return { WidgetLoader, api, Widget };
   });
   ```
3. RequireJS provides dependencies from telesero-base
4. WidgetLoader renders dashboard into container

**State after Step 6**:
- ✅ Dashboard widget rendered
- ✅ Grid layout, cards, data visible
- ✅ ~591KB loaded (dashboard-widget)

### Timeline Visualization

```
Time  Event                        Network          DOM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0ms   User requests page
                                   ↓ GET index.html

50ms  index.html received                           <div id="init-loader">
                                   ↓ GET telesero-base.js

200ms telesero-base.js loaded      [1.06MB cached]  window.teleseroAMD ✓
      RequireJS ready
                                   ↓ GET widget-base.js

350ms widget-base.js loaded        [591KB]          Widget dock ✓
                                   ↓ GET main.bundle.js

500ms main.bundle.js loaded        [2.5MB]          App mounted ✓
      React app renders

600ms User sees login page                          Login form visible
      User logs in, navigates

1200ms User clicks "Dashboard"                      <Dashboard /> mounts
                                   ↓ GET dashboard-widget.js

1350ms dashboard-widget.js loaded  [591KB]          Dashboard renders ✓

1400ms User sees dashboard                          Grid, cards visible
```

### Memory State During Runtime

```
Window Object:
├── window.teleseroAMD
│   ├── require()
│   ├── define()
│   └── requirejs()
│
├── window.React             [From telesero-base, v16.14.0]
├── window.ReactDOM          [From telesero-base]
│
├── RequireJS Module Registry:
│   ├── "telesero-base" → { react, "react-dom", "styled-components", ... }
│   ├── "react" → Alias to telesero-base.react
│   ├── "react-dom" → Alias to telesero-base["react-dom"]
│   ├── "widget-base" → { WidgetLoader, api, components, ... }
│   └── "dashboard-widget" → { WidgetLoader, api, Widget }
│
├── DOM:
│   ├── #root
│   │   └── React app tree (from main.bundle.js)
│   │       └── Dashboard component
│   │           └── #dashboard-widget-container
│   │               └── Dashboard widget React tree
│   │
│   └── Widget Dock (from widget-base)
│       └── Widget buttons
│
└── Loaded Scripts:
    ├── telesero-base.js (1.06MB) [CDN, cached]
    ├── widget-base.js (591KB) [CDN, cached]
    ├── dashboard-widget.js (591KB) [CDN, cached]
    └── main.bundle.js (2.5MB) [App server]

Total JavaScript: ~4.7MB (first load) → ~2.5MB (cached)
```

### Key Insight: Single React Instance

```
Memory Layout:

❌ WITHOUT telesero-base:
┌────────────────────────────────────┐
│ main.bundle.js                     │
│  └── React v16.14 (200KB)          │
│                                    │
│ widget-base.js                     │
│  └── React v16.14 (200KB)          │  ← Duplicate!
│                                    │
│ dashboard-widget.js                │
│  └── React v16.14 (200KB)          │  ← Duplicate!
│                                    │
│ Total: 600KB React + Context issues│
└────────────────────────────────────┘

✅ WITH telesero-base:
┌────────────────────────────────────┐
│ telesero-base.js                   │
│  └── React v16.14 (200KB)          │  ← Single instance
│                                    │
│ widget-base.js                     │
│  └── require("react") → telesero   │  ← Reference
│                                    │
│ dashboard-widget.js                │
│  └── require("react") → telesero   │  ← Reference
│                                    │
│ main.bundle.js                     │
│  └── Uses window.React             │  ← Reference
│                                    │
│ Total: 200KB React + No issues     │
└────────────────────────────────────┘
```

---

## Why AMD & CDN? (vs Modern Approaches)

### The Current Architecture (AMD + CDN)

**Decision Rationale** (likely historical):

1. **Widget System Predates Modern Tooling**
   - Built ~2020-2021 when webpack 4 was standard
   - Micro-frontends weren't mainstream
   - Module Federation didn't exist yet

2. **Need for Runtime Module Loading**
   - Widgets loaded on-demand (not at build time)
   - Users shouldn't wait for all widgets to load
   - CDN provides fast, cached delivery

3. **Shared Dependencies**
   - Multiple widgets need same React version
   - AMD + externals = single React instance
   - Solved the duplicate dependency problem

4. **Version Control**
   - Lock widget versions independently
   - Rollback specific widget without redeploying app
   - Test new widget versions without full deploy

### Modern Alternative: Monorepo + Module Federation

**What Modern Architecture Would Look Like:**

```
monorepo/
├── packages/
│   ├── shared/              ← Like telesero-base
│   │   ├── react
│   │   ├── material-ui
│   │   └── common-utils
│   │
│   ├── widget-base/         ← Federated module
│   ├── dashboard-widget/    ← Federated module
│   ├── backoffice/          ← Host app
│   └── crm/                 ← Host app
│
├── pnpm-workspace.yaml      ← Monorepo config
└── package.json
```

**With Webpack Module Federation:**

```javascript
// webpack.config.js in dashboard-widget
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboardWidget',
      filename: 'remoteEntry.js',
      exposes: {
        './Widget': './src/Widget',
        './WidgetLoader': './src/index'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        '@material-ui/core': { singleton: true }
      }
    })
  ]
};

// In backoffice webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'backoffice',
      remotes: {
        dashboardWidget: 'dashboardWidget@https://cdn.cxcl.io/dashboard-widget/remoteEntry.js'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};

// In app code
const DashboardWidget = React.lazy(() => import('dashboardWidget/Widget'));
```

**Benefits of Modern Approach:**

| Feature | AMD/CDN | Module Federation + Monorepo |
|---------|---------|------------------------------|
| **Shared Dependencies** | ✅ Via AMD externals | ✅ Via shared config |
| **Code Splitting** | ✅ Manual | ✅ Automatic |
| **Type Safety** | ❌ No types across widgets | ✅ TypeScript across packages |
| **Dev Experience** | ⚠️ Build + upload + test | ✅ Hot reload, instant feedback |
| **Tooling** | ⚠️ RequireJS (2011) | ✅ Webpack 5 (2020+) |
| **Tree Shaking** | ❌ Load entire module | ✅ Import only what's needed |
| **Versioning** | ✅ Explicit (CDN URLs) | ⚠️ Requires coordination |
| **Offline Support** | ❌ Requires CDN | ✅ Can bundle fallback |
| **Build Speed** | ⚠️ Slow (multi-stage) | ✅ Fast (parallel) |
| **Bundle Size** | ⚠️ Larger (AMD wrapper) | ✅ Smaller (native ESM) |

### Why Not Migrate Now?

**Challenges**:

1. **Working System**: Current architecture works, migration is risky
2. **Learning Curve**: Team needs to learn Module Federation
3. **Migration Cost**: Rewrite build configs, CI/CD, deployment
4. **Legacy Browser Support**: IE11? (checks browserslist config)
5. **CDN Infrastructure**: Already invested in CDN setup

**When to Consider Migration**:

✅ **Good Time**:
- Adding 5+ more widgets (complexity grows)
- IE11 support dropped (can use native ESM)
- Team size grows (monorepo helps coordination)
- Build times become painful
- Type safety becomes critical

❌ **Bad Time**:
- Right before major release
- Understaffed team
- Current system working fine
- No budget for refactoring

### Hybrid Approach (Recommended Next Step)

Instead of full rewrite, incrementally modernize:

**Phase 1: Keep AMD, Add TypeScript**
```typescript
// dashboard-widget/src/index.d.ts
export interface WidgetLoaderOptions {
  containerId?: string;
  config?: DashboardConfig;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function WidgetLoader(options: WidgetLoaderOptions): void;
```

**Phase 2: Add Vite for Dev, Keep Webpack for Production**
```javascript
// vite.config.js (for development)
export default {
  build: {
    lib: {
      entry: './src/index.js',
      formats: ['es']
    }
  },
  server: {
    port: 3000
  }
};

// Keep webpack for AMD production build
```

**Phase 3: Introduce Module Federation for New Widgets**
```javascript
// New widgets use Module Federation
// Old widgets stay on AMD/CDN
// Gradually migrate when needed
```

**Phase 4: Create Monorepo (Optional)**
```bash
# Only if team agrees, when benefits outweigh costs
pnpm init
pnpm install -g turbo
# Migrate one package at a time
```

---

## Adding New Widgets

### Step-by-Step Guide

Let's say you want to add a new "calendar-widget". Here's the complete process:

#### Step 1: Create Widget Repository

```bash
# Clone dashboard-widget as template
git clone git@github.com:rohitcoding1991/rohit-dashboard-widget.git calendar-widget
cd calendar-widget

# Update package.json
vim package.json
```

```json
{
  "name": "@rohitcoding1991/calendar-widget",
  "version": "1.0.0",
  "main": "src/index.js",
  "module": "src/index.js",
  "exports": {
    ".": "./src/index.js",
    "./amd": "./dist/calendar-widget.js"
  }
}
```

#### Step 2: Configure Build

```javascript
// .neutrinorc.js
const {resolve} = require("path");
const preset = require(resolve("node_modules/@telesero/frontend-common/build-tools/amdPreset.js"));

module.exports = {
  options: {
    root: __dirname
  },
  use: [
    preset("calendar-widget", {  // ← Change module name
      library: true
    }),
    neutrino => {
      // Mark dependencies as external
      neutrino.config.externals({
        "react": "react",
        "react-dom": "react-dom",
        "styled-components": "styled-components",
        "@material-ui/core": ["telesero-base", "@material-ui/core"]
        // Add other externals
      });
    }
  ]
};
```

```javascript
// requirejs.build.js
{
  modules: [
    {
      name: "calendar-widget",  // ← Change module name
      include: [
        "../requirejs.config",
        "calendar-widget"
      ],
      create: true
    }
  ]
}
```

```javascript
// requirejs.standalone-helpers.js
window.CalendarWidgetLoader = function (options) {
  teleseroAMD.require(["calendar-widget"], function (loader) {
    loader.WidgetLoader(options);
  });
};
```

#### Step 3: Develop Widget

```javascript
// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import CalendarComponent from "./Calendar";

export function WidgetLoader(options = {}) {
  const {
    containerId = "calendar-widget-container",
    config = {},
    onLoad = () => {},
    onError = (error) => console.error("Calendar Widget Error:", error)
  } = options;

  try {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with ID "${containerId}" not found`);
    }

    ReactDOM.render(<CalendarComponent config={config} />, container);
    onLoad();
  } catch (error) {
    console.error("Calendar Widget Error:", error);
    onError(error);
    throw error;
  }
}

export const api = {
  CalendarLoader: WidgetLoader
};

export { default as Calendar } from "./Calendar";
```

```javascript
// src/Calendar.js
import React from "react";
import { ThemeProvider } from "@material-ui/core";
import { theme } from "@telesero/frontend-common";
// ... your calendar component

const Calendar = ({ config }) => {
  return (
    <ThemeProvider theme={theme.default}>
      <div>Your calendar UI here</div>
    </ThemeProvider>
  );
};

export default Calendar;
```

#### Step 4: Build & Test Locally

```bash
# Build
npm run build

# Check output
ls -lh dist/
# Should see: calendar-widget.js (~500KB-1MB)

# Test locally (create test.html)
cat > test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Calendar Widget Test</title>
</head>
<body>
  <div id="calendar-widget-container"></div>

  <script src="https://cdn.cxcl.io/telekit/telesero-base-1.0.195.js"></script>
  <script>
    var require = teleseroAMD.require;
    var define = teleseroAMD.define;

    define("calendar-widget", ["react", "react-dom"], function(React, ReactDOM) {
      // Load local build for testing
      return window.CalendarWidgetModule;
    });
  </script>
  <script src="dist/calendar-widget.js"></script>
  <script>
    require(["calendar-widget"], function(widget) {
      widget.WidgetLoader({
        containerId: "calendar-widget-container",
        config: { /* test config */ }
      });
    });
  </script>
</body>
</html>
EOF

# Serve and test
npx serve .
# Open http://localhost:3000/test.html
```

#### Step 5: Publish to GitHub Packages

```bash
# Authenticate
npm login --registry=https://npm.pkg.github.com --scope=@rohitcoding1991

# Publish
npm publish
```

#### Step 6: Upload to CDN

```bash
# Upload dist/calendar-widget.js to CDN
aws s3 cp dist/calendar-widget.js \
  s3://your-cdn-bucket/telekit/calendar-widget-1.0.0.js \
  --content-type "application/javascript" \
  --cache-control "max-age=31536000"

# Verify
curl -I https://cdn.cxcl.io/telekit/calendar-widget-1.0.0.js
# Should return: 200 OK
```

#### Step 7: Update application-frontend-framework

```javascript
// build-tools/index.ejs
require.config({
  paths: {
    "widget-base": "https://cdn.cxcl.io/telekit/widget-base-<%= widget_base_version %>",
    "dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-<%= dashboard_widget_version %>",
    "calendar-widget": "https://cdn.cxcl.io/telekit/calendar-widget-<%= calendar_widget_version %>"  // ← Add
  }
});
```

```javascript
// src/containers/Calendar/index.js
import React from "react";

const Calendar = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof window.teleseroAMD !== "undefined") {
      // Production: AMD
      window.teleseroAMD.require(["calendar-widget"], (module) => {
        module.WidgetLoader({
          containerId: "calendar-widget-container",
          onLoad: () => setLoading(false)
        });
      });
    } else {
      // Development: ES modules
      import("@rohitcoding1991/calendar-widget")
        .then((module) => {
          module.WidgetLoader({
            containerId: "calendar-widget-container",
            onLoad: () => setLoading(false)
          });
        });
    }
  }, []);

  return (
    <div>
      {loading && <div>Loading calendar...</div>}
      <div id="calendar-widget-container" />
    </div>
  );
};

export default Calendar;
```

```javascript
// src/index.js
export { default as Calendar } from "./containers/Calendar";
```

#### Step 8: Update backoffice/CRM

```bash
cd backoffice-frontend

# Install updated telekit
npm install @telesero/telekit@latest

# Use Calendar component
# src/pages/CalendarPage.js
import { Calendar } from "@telesero/telekit";

function CalendarPage() {
  return <Calendar />;
}
```

```javascript
// Update build config
// build.config.js or similar
module.exports = {
  calendar_widget_version: "1.0.0"  // ← Add version
};
```

```bash
# Build
npm run build

# Verify index.html includes calendar-widget CDN URL
grep calendar-widget build/index.html

# Deploy
npm run deploy:staging
# Test on staging
npm run deploy:production
```

#### Step 9: Create Documentation

```markdown
# Calendar Widget

## Installation

\`\`\`bash
npm install @rohitcoding1991/calendar-widget
\`\`\`

## Usage

### Production (AMD)
\`\`\`javascript
require(["calendar-widget"], (widget) => {
  widget.WidgetLoader({ /* config */ });
});
\`\`\`

### Development (ES Modules)
\`\`\`javascript
import { WidgetLoader } from "@rohitcoding1991/calendar-widget";
WidgetLoader({ /* config */ });
\`\`\`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| containerId | string | "calendar-widget-container" | DOM element ID |
| config | object | {} | Widget configuration |
```

---

## Troubleshooting Guide

### Common Issues & Solutions

#### Issue 1: "Module name 'react' has not been loaded yet"

**Symptoms**:
```
Error: Module name "react" has not been loaded yet for context: _
https://requirejs.org/docs/errors.html#notloaded
```

**Cause**:
- AMD environment not set up
- `telesero-base.js` not loaded
- RequireJS not configured

**Solution**:

1. **Check telesero-base is loaded**:
   ```javascript
   console.log(window.teleseroAMD);
   // Should show: { require, define, requirejs }
   ```

2. **Check RequireJS config**:
   ```javascript
   console.log(require.s.contexts._.config.paths);
   // Should include: { "widget-base": "...", "dashboard-widget": "..." }
   ```

3. **Verify loading order in index.html**:
   ```html
   <!-- Correct order: -->
   <script src="telesero-base.js"></script>  <!-- 1. Base first -->
   <script>require.config({ ... })</script>   <!-- 2. Config second -->
   <script src="app.js"></script>             <!-- 3. App last -->
   ```

#### Issue 2: Duplicate React Warnings

**Symptoms**:
```
Warning: Invalid hook call. Hooks can only be called inside the body of a function component.
This could happen for one of the following reasons:
1. You might have mismatching versions of React and React DOM
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
```

**Cause**:
- Widget bundled its own React instead of using external
- Version mismatch between telesero-base and app

**Solution**:

1. **Check widget webpack config**:
   ```javascript
   // .neutrinorc.js must have:
   neutrino.config.externals({
     "react": "react",  // ← Must be external!
     "react-dom": "react-dom"
   });
   ```

2. **Verify build output**:
   ```bash
   # Widget should NOT contain React code
   grep -i "react.createElement" dist/dashboard-widget.js
   # Should find: define("dashboard-widget", ["react"], ...)
   # Should NOT find: React implementation code
   ```

3. **Check versions match**:
   ```bash
   # All should be same version
   grep '"react"' frontend-common/package.json
   grep '"react"' widget-base/package.json
   grep '"react"' dashboard-widget/package.json
   # All should show: "react": "^16.14.0"
   ```

#### Issue 3: CDN 404 Not Found

**Symptoms**:
```
GET https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8.js
Status: 404 Not Found
```

**Cause**:
- File not uploaded to CDN
- Wrong version in configuration
- CDN cache not cleared

**Solution**:

1. **Verify file exists**:
   ```bash
   curl -I https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8.js
   # Should return: HTTP/1.1 200 OK
   ```

2. **Check version in code**:
   ```bash
   # application-frontend-framework
   grep dashboard_widget_version build-tools/index.ejs

   # backoffice-frontend
   grep dashboard_widget build/index.html
   ```

3. **Upload if missing**:
   ```bash
   aws s3 cp dist/dashboard-widget.js \
     s3://cdn-bucket/telekit/dashboard-widget-1.0.8.js
   ```

4. **Clear CDN cache** (if file was replaced):
   ```bash
   # Depends on your CDN provider
   # CloudFront example:
   aws cloudfront create-invalidation \
     --distribution-id EXXXXXXXXXXXXX \
     --paths "/telekit/dashboard-widget-1.0.8.js"
   ```

#### Issue 4: Widget Loads But Shows Blank

**Symptoms**:
- No errors in console
- Container div exists but empty
- Network shows widget.js loaded (200 OK)

**Cause**:
- Container ID mismatch
- Widget failed silently
- CSS/styling issues

**Solution**:

1. **Check container ID matches**:
   ```javascript
   // Component
   <div id="dashboard-widget-container" />

   // Widget config
   WidgetLoader({
     containerId: "dashboard-widget-container"  // ← Must match!
   });
   ```

2. **Enable verbose logging**:
   ```javascript
   // Add to widget loader
   console.log("Loading widget...");
   WidgetLoader({
     containerId: "dashboard-widget-container",
     onLoad: () => console.log("Widget loaded!"),
     onError: (err) => console.error("Widget error:", err)
   });
   ```

3. **Check React rendered**:
   ```javascript
   // In browser console
   const container = document.getElementById("dashboard-widget-container");
   console.log(container.innerHTML);
   // Should show React component markup
   ```

4. **Inspect with React DevTools**:
   - Install React DevTools browser extension
   - Check if widget component tree appears
   - Look for error boundaries or conditional renders

#### Issue 5: Storybook Shows RequireJS Error

**Symptoms**:
```
ReferenceError: require is not defined
  at Dashboard.js:25
```

**Cause**:
- Trying to use AMD `require()` in Storybook
- Dual-loading logic not implemented

**Solution**:

1. **Implement dual-loading** (see Dashboard/index.js example above)

2. **Install widget in package.json**:
   ```bash
   npm install @rohitcoding1991/rohit-dashboard-widget@latest
   ```

3. **Mock AMD for Storybook** (alternative):
   ```javascript
   // .storybook/preview.js
   if (typeof window !== 'undefined' && !window.teleseroAMD) {
     window.teleseroAMD = {
       require: (deps, callback) => {
         // Mock implementation
         import("@rohitcoding1991/rohit-dashboard-widget")
           .then((module) => callback(module));
       }
     };
   }
   ```

#### Issue 6: Build Fails with "Cannot find module"

**Symptoms**:
```
ERROR in ./src/index.js
Module not found: Error: Can't resolve '@telesero/frontend-common'
```

**Cause**:
- Dependency not installed
- Wrong import path
- Build cache corrupted

**Solution**:

1. **Install dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check import path**:
   ```javascript
   // Correct
   import { theme } from "@telesero/frontend-common";

   // Wrong
   import { theme } from "frontend-common";
   ```

3. **Clear build cache**:
   ```bash
   rm -rf node_modules/.cache
   rm -rf dist/ build/
   npm run build
   ```

#### Issue 7: Widget Styles Look Wrong

**Symptoms**:
- Widget loads but styling is broken
- Colors don't match design
- Layout is messed up

**Cause**:
- Material-UI version mismatch
- styled-components version conflict
- CSS specificity issues

**Solution**:

1. **Check version consistency**:
   ```bash
   # All should match
   grep "@material-ui/core" */package.json
   # Should all be "^4.11.0"
   ```

2. **Use StylesProvider with unique prefix**:
   ```javascript
   // In widget
   import { StylesProvider, createGenerateClassName } from "@material-ui/core";

   const generateClassName = createGenerateClassName({
     productionPrefix: "widget-dashboard",
     seed: "widget-dashboard"
   });

   <StylesProvider generateClassName={generateClassName}>
     <Widget />
   </StylesProvider>
   ```

3. **Check for CSS conflicts**:
   ```javascript
   // In browser console
   document.querySelectorAll('[class*="jss"]');
   // Look for duplicate class names from different sources
   ```

---

## Summary for AI Agents

### Key Concepts to Remember

1. **Three-Layer Architecture**:
   - **Base** (frontend-common → telesero-base.js): Shared dependencies
   - **Widgets** (widget-base, dashboard-widget): Feature modules
   - **Apps** (backoffice, CRM): End-user applications

2. **Build Process**:
   - Source: ES modules (`import`/`export`)
   - Build: Webpack → AMD bundle (`define`)
   - Deploy: Upload to CDN → Load via RequireJS

3. **Dual-Loading Pattern**:
   - Production: `require(["module"])` from CDN
   - Development: `import("module")` from node_modules

4. **Shared Dependencies**:
   - React, Material-UI, etc. in telesero-base
   - Widgets use `externals` to avoid bundling
   - Single React instance in browser

5. **application-frontend-framework (telekit)**:
   - Shared component library
   - Provides build template (index.ejs)
   - Consumed by backoffice and CRM
   - Not bundled, distributed via npm

### When Debugging

1. **Check loading order**: telesero-base → config → app
2. **Verify AMD environment**: `window.teleseroAMD` must exist
3. **Inspect RequireJS config**: `require.s.contexts._.config.paths`
4. **Check network tab**: Verify CDN URLs return 200
5. **Look for duplicate React**: Use React DevTools

### When Adding Features

1. **New Component in telekit**: Just add to `src/`, publish to npm
2. **New Widget**: Follow "Adding New Widgets" guide
3. **Update Dependency**: Rebuild telesero-base, upload to CDN, update version everywhere
4. **Change Build Process**: Update all three layers (base, widget, app)

### Architecture Decision Records

| Decision | Reason | Trade-off |
|----------|--------|-----------|
| AMD over ES modules | Runtime loading, CDN support | Verbose, outdated |
| CDN over bundling | Shared dependencies, caching | Single point of failure |
| Separate repos | Independent versioning | Complex coordination |
| telekit as npm package | Code reuse | Extra indirection |
| Dual-loading pattern | Works in both environments | More complex code |

---

## Conclusion

This architecture is a **working solution** for a complex problem: sharing widgets across multiple applications while maintaining single versions of dependencies.

**It's not modern**, but it:
- ✅ Works reliably in production
- ✅ Solves the duplicate React problem
- ✅ Allows independent widget deployment
- ✅ Provides version control and rollback
- ✅ Enables code sharing via telekit

**Consider migrating to modern approaches** (Module Federation, monorepo) when:
- Team has bandwidth for refactoring
- Benefits outweigh migration costs
- Legacy browser support is dropped
- Widget ecosystem grows significantly

**For now**, understand the architecture, follow the patterns, and maintain consistency across all layers.
