nodeRequire(
  path.resolve(
    "./node_modules/@telesero/frontend-common/build-tools",
    "config-process.js"
  )
)(
  {
    appDir: "build/",
    baseUrl: ".",
    dir: "dist/",
    // aliases
    paths: {
    },
    // wrapper files
    wrap: {
      start: "(function(define,require,requirejs) {",
      end: "}(window.teleseroAMD.define, window.teleseroAMD.require, window.teleseroAMD.requirejs));"
    },
    removeCombined: true,
    optimize: process.env.BUILD_DEBUG ? "none" : "uglify",
    skipDirOptimize: true,
    writeBuildTxt: false,
    modules: [
      {
        name: "dashboard-widget",
        include: [
          "../requirejs.config",
          "dashboard-widget"
        ],
        //True tells the optimizer it is OK to create
        //a new file widget-base.js. Normally the optimizer
        //wants foo.js to exist in the source directory.
        create: true
      }
    ]
  },
  nodeRequire(
    path.resolve(
      "./node_modules/@telesero/frontend-common/build-tools",
      "amd-asset-webpack-plugin"
    )
  ).processRequireJsBuild("dashboard-widget"),
  nodeRequire(
    path.resolve(
      "./node_modules/@telesero/frontend-common/build-tools",
      "frontend-common-webpack-plugin"
    )
  ).processRequireJsBuild("dashboard-widget"),
  config => console.log("---------- BUILD CONFIG \n", config, "\n ----------- Module Includes \n", config.modules[0], `\n -------------`)
);
