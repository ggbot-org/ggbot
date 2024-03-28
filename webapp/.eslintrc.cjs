module.exports = {
	env: { browser: true, es2020: true, node: false },
	extends: [
		"@workspace/eslint-config",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		project: [
			"./tsconfig.scripts.json",
			"./tsconfig.webapp.json",
			"./tsconfig.workers.json"
		],
		tsconfigRootDir: __dirname
	},
	plugins: [
		"@typescript-eslint",
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
		"@typescript-eslint/ban-ts-comment": "warn",
		"@typescript-eslint/no-array-constructor": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-extra-semi": "off",
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
		"func-style": ["warn", "expression"],
		"import/extensions": "off",
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
		// TODO remove this no-console
		"no-console": ["error", { allow: ["error"] }],
		// TODO remove this no-warning-comments
		"no-warning-comments": "warn",
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
		// TODO remove all switches then remove this override
		"smells/no-switch": "warn"
	},
	settings: {
		react: {
			version: "detect"
		}
	}
}
