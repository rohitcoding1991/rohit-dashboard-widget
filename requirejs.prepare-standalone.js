console.log("Preparing concatenated standalone file");
const path = require("path");
const fs = require("fs");

const output = path.resolve("dist", "widgets.js");
const concat = require("concatenate-files");
const teleseroBase = path.resolve("dist", "telesero-base.js");
const dashboardWidget = path.resolve("dist", "dashboard-widget.js");
const helpers = path.resolve("requirejs.standalone-helpers.js");
if (!fs.existsSync(teleseroBase)) {
  console.error("File not found:", teleseroBase);
  process.exit(1);
}
if (!fs.existsSync(dashboardWidget)) {
  console.error("File not found:", dashboardWidget);
  process.exit(1);
}
if (!fs.existsSync(helpers)) {
  console.error("File not found:", helpers);
  process.exit(1);
}

concat(
  [teleseroBase, dashboardWidget, helpers],
  output,
  {
    separator: ";\n"
  },
  function (err, result) {
    if (err) throw err;

    console.info("Done preparing standalone file!", result.outputFile);
  }
);
