/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  moduleNameMapper: {
    "(.+)\\.js": "$1",
  },
  preset: "ts-jest",
  testEnvironment: "node",
};
