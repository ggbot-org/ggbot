module.exports = {
  extends: ["./base.cjs", "plugin:react/jsx-runtime"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["jsx-a11y", "react", "react-hooks"],
  rules: {
    "import/extensions": [
      "error",
      "never",
      {
        css: "always",
      },
    ],
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error",
    "react/display-name": "error",
    "react/jsx-key": "error",
    "react/jsx-sort-props": [
      "error",
      { noSortAlphabetically: true, reservedFirst: true, shorthandFirst: true },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
