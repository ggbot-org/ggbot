module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": ["error", { allow: ["error", "info", "warn"] }],
  },
};
