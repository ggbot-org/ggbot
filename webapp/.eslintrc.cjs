// TODO remove this file
module.exports = {
	env: { browser: true, es2020: true, node: false },
	extends: [
		"../.eslintrc.cjs",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
	],
	ignorePatterns: ["dist"],
	parser: "@typescript-eslint/parser",
	plugins: [
		"@stylistic",
		"@typescript-eslint",
		"eslint-plugin-react-compiler",
		"eslint-plugin-tsdoc",
		"formatjs",
		"import",
		"jsx-a11y",
		"react",
		"react-hooks",
	],
	rules: {
		"@stylistic/jsx-closing-bracket-location": "error",
		"@stylistic/jsx-closing-tag-location": "error",
		"@stylistic/jsx-curly-brace-presence": ["error", { children: "never", props: "never", propElementValues: "always" }],
		"@stylistic/jsx-curly-spacing": "error",
		"@stylistic/jsx-equals-spacing": "error",
		"@stylistic/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
		"@stylistic/jsx-indent": ["error", "tab"],
		"@stylistic/jsx-max-props-per-line": ["error", { maximum: 1, when: "multiline" }],
		"@stylistic/jsx-props-no-multi-spaces": "error",
		"@stylistic/jsx-quotes": ["error", "prefer-double"],
		"@stylistic/jsx-self-closing-comp": "error",
		"@stylistic/jsx-sort-props": ["error", { "reservedFirst": true, "shorthandFirst": true }],
		"@stylistic/jsx-tag-spacing": "error",
		"@stylistic/jsx-wrap-multilines": ["error",
			{
				assignment: "parens-new-line",
				condition: "parens-new-line",
				declaration: "parens-new-line",
				logical: "parens-new-line",
				prop: "ignore",
				propertyValue: "parens-new-line",
				return: "parens-new-line",
			}],

		// TODO set "@typescript-eslint/ban-ts-comment": "warn",
		"@typescript-eslint/ban-ts-comment": "off",

		"formatjs/enforce-placeholders": "error",
		"formatjs/no-literal-string-in-jsx": ["error",
			{
				props: {
					include: [
						// check aria attributes that the screen reader announces.
						["*", "aria-{label,description,details,errormessage}"],
						// check placeholder and title attribute of all native DOM elements.
						["[a-z]*([a-z0-9])", "(placeholder|title)"],
						// check alt attribute of the img tag.
						["img", "alt"],
						// check other props that may contain literal strings
						["*", "header"],
						["*", "label"],
					],
				},
			}],
		"formatjs/prefer-pound-in-plural": "error",

		// Define React components as functions.
		"func-style": ["error", "declaration"],

		// Imports in bundled code do not need extension.
		"import/extensions": "off",

		"jsx-a11y/aria-props": "error",
		"jsx-a11y/aria-proptypes": "error",
		"jsx-a11y/aria-unsupported-elements": "error",
		"jsx-a11y/role-has-required-aria-props": "error",

		"react-hooks/exhaustive-deps": "error",
		"react-hooks/rules-of-hooks": "error",
		"react/display-name": "error",
		"react/function-component-definition": ["error", { "namedComponents": "function-declaration" }],
		"react/hook-use-state": ["error", { allowDestructuredState: true }],

		"react/jsx-boolean-value": "error",
		"react/jsx-key": "error",
		"react/jsx-newline": ["error", { prevent: true }],
		"react/jsx-no-comment-textnodes": "error",
		"react/jsx-no-constructed-context-values": "error",
		"react/jsx-no-duplicate-props": "error",
		"react/jsx-no-leaked-render": "error",
		"react/jsx-no-useless-fragment": "error",
		"react/jsx-pascal-case": ["error", { allowLeadingUnderscore: true }],
		"react/jsx-sort-props": ["error", { noSortAlphabetically: true, reservedFirst: true, shorthandFirst: true }],
		"react/jsx-wrap-multilines": "error",

		"react/no-array-index-key": "error",
		"react/no-danger": "error",
		"react/no-deprecated": "error",
		"react/prop-types": "off",
		"react/self-closing-comp": ["error", { component: true, html: true }],
		"react-compiler/react-compiler": "error",
	},
	settings: {
		react: { version: "detect" },
	},
}
