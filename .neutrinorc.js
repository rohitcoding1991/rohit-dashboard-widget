const {resolve} = require("path");
const preset = require(resolve("node_modules/@telesero/frontend-common/build-tools/amdPreset.js"));
const FrontendCommonWebpackPlugin = require(resolve("node_modules/@telesero/frontend-common/build-tools/frontend-common-webpack-plugin.js"));
const AmdAssetWebpackPlugin = require(resolve("node_modules/@telesero/frontend-common/build-tools/amd-asset-webpack-plugin.js"));

module.exports = {
  options: {
    root: __dirname
  },
  use: [
    preset("dashboard-widget", {
      library: true
    }),
    neutrino => {
      neutrino.config.plugin("frontend-common-webpack-plugin").use(FrontendCommonWebpackPlugin);
      neutrino.config.plugin("dashboard-widget-amd-assets").use(AmdAssetWebpackPlugin).init(
        AmdAssetWebpackPlugin => new AmdAssetWebpackPlugin("dashboard-widget")
          .add("styled-components", "/dist/styled-components.js"))

      // Include @telesero/widget-base and react-grid-layout in Babel compilation to handle ES6 syntax
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
