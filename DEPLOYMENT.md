# Dashboard Widget - Deployment Guide

## Overview

This widget is deployed in a **dual-loading architecture** to support both:
- **Production**: AMD/RequireJS loading from CDN (backoffice/crm)
- **Development**: ES module imports from npm (Storybook/local)

## Step-by-Step Deployment

### 1. Build the Widget

```bash
cd rohit-dashboard-widget

# Build both ES modules and AMD bundles
npm run build

# This creates:
# - build/dashboard-widget.js (intermediate AMD build)
# - dist/dashboard-widget.js (optimized AMD module)
# - dist/widgets.js (standalone with helper)
```

### 2. Publish to GitHub Packages

```bash
# Bump version
npm version patch  # or minor/major

# Publish for npm install usage
npm publish
```

### 3. Upload to CDN

Upload `dist/dashboard-widget.js` to your CDN:

```bash
# Example: Upload to CDN
# File: dist/dashboard-widget.js
# Destination: https://cdn.cxcl.io/telekit/dashboard-widget-{version}.js

# Example using AWS S3/CloudFront
aws s3 cp dist/dashboard-widget.js \
  s3://your-cdn-bucket/telekit/dashboard-widget-1.0.8.js \
  --content-type "application/javascript" \
  --cache-control "max-age=31536000"

# Or using scp/rsync to your CDN server
scp dist/dashboard-widget.js \
  user@cdn.cxcl.io:/var/www/telekit/dashboard-widget-1.0.8.js
```

**Verify CDN upload:**
```bash
curl -I https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8.js
# Should return 200 OK
```

### 4. Update application-frontend-framework

#### 4.1 Update index.ejs

Edit `build-tools/index.ejs`:

```ejs
paths: {
  ...config.paths,
  "widget-base": "https://cdn.cxcl.io/telekit/widget-base-<%= widget_base_version %>",
  "dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-<%= dashboard_widget_version || '1.0.8' %>"
}
```

#### 4.2 Update package version variable

If you use a build config file, update the dashboard_widget_version:

```javascript
// build-config.js or similar
module.exports = {
  frontend_common_version: "1.0.195",
  widget_base_version: "1.0.103",
  dashboard_widget_version: "1.0.8"  // Update this
};
```

#### 4.3 Update npm package (for development)

```bash
cd application-frontend-framework

# Update dashboard widget in package.json
npm install @rohitcoding1991/rohit-dashboard-widget@latest

# Or with yarn
yarn upgrade @rohitcoding1991/rohit-dashboard-widget
```

#### 4.4 Build and publish telekit

```bash
# Build the telekit package
npm run dist

# This should now include the updated Dashboard component
# with dual-loading support
```

### 5. Deploy to Backoffice/CRM

#### 5.1 Update telekit in backoffice

```bash
cd backoffice-frontend

# Update telekit
npm install @telesero/telekit@latest

# Or with yarn
yarn upgrade @telesero/telekit
```

#### 5.2 Build backoffice

```bash
# Build generates index.html that loads:
# - telesero-base.js from CDN
# - widget-base.js from CDN
# - dashboard-widget.js from CDN (NEW!)

npm run build
```

#### 5.3 Verify the build

Check `build/index.html`:

```html
<script src="https://cdn.cxcl.io/telekit/telesero-base-1.0.195.js"></script>
<script>
  require.config({
    paths: {
      "widget-base": "https://cdn.cxcl.io/telekit/widget-base-1.0.103",
      "dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8"
    }
  });
</script>
```

#### 5.4 Deploy to production

```bash
# Deploy using your deployment process
# Example:
npm run deploy:production
```

### 6. Repeat for CRM

```bash
cd crm-frontend

# Same process as backoffice
npm install @telesero/telekit@latest
npm run build
npm run deploy:production
```

## Testing

### Test in Development (Storybook)

```bash
cd application-frontend-framework

# Start Storybook
npm run storybook

# Navigate to Dashboard story
# Should load widget via ES modules (no AMD)
# Check console: "Loading dashboard widget via ES modules..."
```

### Test in Production (Local)

```bash
cd backoffice-frontend

# Build production
npm run build

# Serve locally
npx serve build

# Open browser
# Check console: "Loading dashboard widget via AMD..."
# Check Network tab: Should load dashboard-widget.js from CDN
```

### Verification Checklist

- [ ] Widget loads in Storybook without RequireJS errors
- [ ] Widget loads in backoffice production build
- [ ] Widget loads in CRM production build
- [ ] No duplicate React warnings
- [ ] Console shows correct loading method:
  - Development: "Loading dashboard widget via ES modules..."
  - Production: "Loading dashboard widget via AMD..."
- [ ] Network tab shows dashboard-widget.js loaded from CDN (production)
- [ ] Dashboard renders correctly with data
- [ ] No console errors

## Troubleshooting

### Issue: "Module name 'react' has not been loaded yet"

**Cause**: Trying to use AMD loading but telesero-base isn't loaded or AMD environment not configured.

**Solution**:
1. Check that `index.html` loads `telesero-base.js` before your app
2. Verify `window.teleseroAMD` exists
3. Check that `require.config` includes dashboard-widget path

### Issue: Dashboard component is blank in Storybook

**Cause**: Widget might be trying to load via AMD but Storybook doesn't have AMD environment.

**Solution**:
1. Verify dual-loading logic in Dashboard/index.js
2. Check that ES module import fallback is working
3. Install widget from npm: `npm install @rohitcoding1991/rohit-dashboard-widget@latest`

### Issue: CDN 404 for dashboard-widget.js

**Cause**: File not uploaded to CDN or incorrect version in config.

**Solution**:
1. Verify file exists: `curl -I https://cdn.cxcl.io/telekit/dashboard-widget-1.0.8.js`
2. Check version matches in index.ejs
3. Upload file to CDN if missing

### Issue: Widget loads but has styling issues

**Cause**: Styled-components version mismatch or class name collisions.

**Solution**:
1. Check styled-components version matches telesero-base
2. Verify widget uses unique class name prefix (widget-dashboard)
3. Check StylesProvider configuration in Widget.js

## Rollback Procedure

If deployment causes issues:

### 1. Revert CDN to Previous Version

Update `index.ejs`:

```ejs
"dashboard-widget": "https://cdn.cxcl.io/telekit/dashboard-widget-1.0.7"
```

### 2. Rebuild and Redeploy

```bash
cd application-frontend-framework
npm run dist

cd backoffice-frontend
npm install @telesero/telekit@previous-version
npm run build
npm run deploy
```

### 3. Verify Rollback

Check that old version loads and works correctly.

## Version Management

### Semantic Versioning

- **Patch (1.0.x)**: Bug fixes, no breaking changes
- **Minor (1.x.0)**: New features, backward compatible
- **Major (x.0.0)**: Breaking changes

### Version Update Checklist

When bumping version:

1. Update package.json version
2. Build and test locally
3. Publish to GitHub Packages
4. Upload new version to CDN
5. Keep old version on CDN (for rollback)
6. Update version in application-frontend-framework
7. Test in backoffice/CRM staging
8. Deploy to production
9. Tag release in git: `git tag v1.0.8 && git push --tags`

## Monitoring

After deployment, monitor:

- CDN hit rate for dashboard-widget.js
- Browser console for errors
- Loading time metrics
- User-reported issues

## Support

For deployment issues:
1. Check this guide's troubleshooting section
2. Review CLAUDE.md for architecture details
3. Check widget build logs
4. Contact team for CDN access issues
