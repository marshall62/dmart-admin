const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    setupFilesAfterEnv: ["./jest.setup.js"],
    testEnvironment: "jsdom",
    moduleNameMapper: {...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/'
    }), "^.+\\.(css|less)$": '<rootDir>/test/jest-css-stub.js'}
    // moduleNameMapper: {
    //     "^@/components/(.*)$": "<rootDir>/components/$1",
    //     "^@/state/(.*)$": "<rootDir>/components/state/$1",
    //     "^@/pages/(.*)$": "<rootDir>/pages/$1",
    //     "^@/styles/(.*)$": "<rootDir>/styles/$1",
    //     "^@/(.*)$": "<rootDir>/$1",
    //     "^.+\\.(css|less)$": '<rootDir>/test/jest-css-stub.js'
    //   },
};