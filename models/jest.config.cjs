const path = require("path");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  moduleNameMapper: {
    "(.+)\\.js": "$1",
    "@ggbot2/(.*)": path.resolve(__dirname, "../$1/src/index.ts"),
  },
  preset: "ts-jest",
  testEnvironment: "node",
};
