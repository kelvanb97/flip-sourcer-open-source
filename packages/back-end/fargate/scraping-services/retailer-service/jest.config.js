module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  modulePathIgnorePatterns: ["dist", "node_modules"],
  setupFilesAfterEnv: ["./jest.setup.js"],
};
