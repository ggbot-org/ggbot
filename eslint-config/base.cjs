module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  root: true,
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
    "block-scoped-var": "error",
    camelcase: "error",
    "default-param-last": "error",
    "dot-notation": "error",
    eqeqeq: "error",
    "func-style": ["warn", "expression"],
    "import/extensions": ["error", "ignorePackages"],
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-cycle": "error",
    "import/order": ["error", { "newlines-between": "never" }],
    "max-depth": ["error", 5],
    "no-case-declarations": "error",
    "no-console": ["error", { allow: ["error", "info", "warn"] }],
    "no-extra-label": "warn",
    "no-floating-decimal": "error",
    "no-global-assign": "error",
    "no-implicit-coercion": "error",
    "no-implicit-globals": "error",
    "no-inline-comments": "error",
    "no-lonely-if": "error",
    "no-multi-assign": "error",
    "no-warning-comments": "warn",
  },
};
