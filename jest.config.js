const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  testEnvironment: "jsdom",
  testEnvironmentOptions: { resources: "usable" },
  modulePaths: ["node_modules", "<rootDir>/src"],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths),
  },
  preset: "ts-jest",
};
