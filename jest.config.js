module.exports = {
    setupFilesAfterEnv: ["./jest.setup.js"],
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^@/components(.*)$": "<rootDir>/components",
        "^@/pages(.*)$": "<rootDir>/pages",
        "^@/hooks(.*)$": "<rootDir>/hooks",
        "^@/styles(.*)$": "<rootDir>/styles",
        "^.+\\.(css|less)$": '<rootDir>/test/jest-css-stub.js'
      },
};