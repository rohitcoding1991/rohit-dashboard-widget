const neutrino = require("neutrino");

// Set a default NODE_ENV before loading any middleware
process.env.NODE_ENV = process.env.NODE_ENV || "test";

const jest = neutrino().jest();
jest.testRegex = jest.testRegex.replace("test/.*", "(test|src)/.*");
jest.transformIgnorePatterns = ["node_modules/(?!mui-datatables|@telesero)"];

module.exports = jest;
