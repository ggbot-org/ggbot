module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "import/extensions": ["error", "ignorePackages"],
    "no-console": ["error", { allow: ["error", "info", "warn"] }],
    "no-warning-comments": "warn",
  },
};
