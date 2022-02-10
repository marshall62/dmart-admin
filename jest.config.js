module.exports = {
    setupFilesAfterEnv: ["./jest.setup.js"],
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^@/components/(.*)$": "<rootDir>/components/$1",
        "^@/state/(.*)$": "<rootDir>/components/state/$1",
        "^@/pages/(.*)$": "<rootDir>/pages/$1",
        "^@/hooks/(.*)$": "<rootDir>/hooks/$1",
        "^@/styles/(.*)$": "<rootDir>/styles/$1",
        "^.+\\.(css|less)$": '<rootDir>/test/jest-css-stub.js'
      },
};