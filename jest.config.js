const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  testEnvironment: "jsdom",
  testEnvironmentOptions: { resources: "usable" },
  modulePaths: ["node_modules", "<rootDir>/src"],
  moduleNameMapper: {
    // "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
    //   "<rootDir>/__mocks__/fileMock.js",
    // "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",

    ...pathsToModuleNameMapper(compilerOptions.paths),
  },
  preset: "ts-jest",
};
