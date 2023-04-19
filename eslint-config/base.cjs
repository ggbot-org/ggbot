module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        // Follow the TypeScript convention to prepend an underscore to
        // ignore when a variable is not used.
        // This works also with TypeScript compiler options
        // ```json
        // "noUnusedLocals": true,
        // "noUnusedParameters": true,
        // ```
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "arrow-body-style": ["error", "as-needed"],
    "import/extensions": ["error", "ignorePackages"],
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-cycle": "error",
    "import/order": ["error", { "newlines-between": "never" }],
    "no-console": ["error", { allow: ["error", "info", "warn"] }],
    "no-warning-comments": "warn",
  },
};
