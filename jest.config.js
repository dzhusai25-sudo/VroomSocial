/**
 * Jest configuration
 * @type {import('jest').Config}
 */
const config = {
  testEnvironment: "jsdom",
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text"],
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Игнор типов и вспомогательных файлов
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/types.tsx",
    "/src/__mocks__/",
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/lib/"],
  preset: "ts-jest",

  moduleNameMapper: {
    "\\.css$": "<rootDir>/__mocks__/styleMock.js",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/index.{ts,tsx}",
  ],
  transform: {
  '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ["/node_modules/"],
};

module.exports = config;