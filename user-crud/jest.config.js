const { pathsToModuleNameMapper } = require("ts-jest/utils");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(
    {
      "@modules/*": ["modules/*"],
      "@config/*": ["config/*"],
      "@shared/*": ["shared/*"],
      "@utils/*": ["utils/*"],
    },
    { prefix: "<rootDir>/src" }
  ),
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  bail: true,
  clearMocks: true,
  collectCoverageFrom: [
    "<rootDir>/src/modules/**/services/*.ts",
    "!<rootDir>/src/modules/investmentStocks/services/ListStockInfoService.ts",
    "!<rootDir>/src/modules/investmentStocks/services/ListHistoryBySectorService.ts",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["text-summary", "lcov", "clover"],
  setupFiles: ["./jest-setup-file.ts"],
  testMatch: ["**/*.spec.ts"],
  setupFiles: ["dotenv/config", "reflect-metadata"],
};
