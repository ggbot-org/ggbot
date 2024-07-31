module.exports = {
	env: { browser: true, es2020: true, node: false },
	extends: [
		"../.eslintrc.cjs",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime"
	],
	ignorePatterns: ["dist"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		project: ["./tsconfig.json", "./tsconfig.scripts.json"]
	},
	plugins: [
		"@typescript-eslint",
		"eslint-plugin-react-compiler",
		"eslint-plugin-tsdoc",
		"formatjs",
		"import",
		"jsx-a11y",
		"react",
		"react-hooks",
		"simple-import-sort",
		"smells"
	],
	root: true,
	rules: {
		// TODO set "@typescript-eslint/ban-ts-comment": "warn",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-array-constructor": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-extra-semi": "off",
		// A non-null assertion is used in ./src/react/mount.tsx
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unsafe-argument": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
		// @typescript-eslint/unbound-method rule is not compatible with hooks,
		// it reports this as an error:
		// ```ts
		// const { formatMessage } = useIntl()
		// ```
		"@typescript-eslint/unbound-method": "off",
		"formatjs/enforce-placeholders": "error",
		"formatjs/no-literal-string-in-jsx": [
			"warn",
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
						["*", "label"]
					]
				}
			}
		],
		"import/extensions": "off",
		// TODO why import/no-cycle complains?
		"import/no-cycle": "off",
		"import/no-internal-modules": [
			"error",
			{
				allow: ["react-dom/client"]
			}
		],
		"jsx-a11y/aria-props": "error",
		"jsx-a11y/aria-proptypes": "error",
		"jsx-a11y/aria-unsupported-elements": "error",
		"jsx-a11y/role-has-required-aria-props": "error",
		"no-case-declarations": "error",
		"react-hooks/exhaustive-deps": "error",
		"react-hooks/rules-of-hooks": "error",
		"react/display-name": "error",
		"react/hook-use-state": ["error", { allowDestructuredState: true }],
		"react/jsx-boolean-value": "error",
		"react/jsx-key": "error",
		"react/jsx-newline": ["error", { prevent: false }],
		"react/jsx-no-comment-textnodes": "error",
		"react/jsx-no-constructed-context-values": "error",
		"react/jsx-no-duplicate-props": "error",
		"react/jsx-no-leaked-render": "error",
		"react/jsx-no-useless-fragment": "error",
		"react/jsx-pascal-case": ["error", { allowLeadingUnderscore: true }],
		"react/jsx-sort-props": [
			"error",
			{
				noSortAlphabetically: true,
				reservedFirst: true,
				shorthandFirst: true
			}
		],
		"react/jsx-wrap-multilines": "error",
		"react/no-array-index-key": "error",
		"react/no-danger": "error",
		"react/no-deprecated": "error",
		"react/prop-types": "off",
		"react/self-closing-comp": ["error", { component: true, html: true }],
		"react-compiler/react-compiler": "error"
	},
	settings: {
		react: {
			version: "detect"
		}
	}
}
