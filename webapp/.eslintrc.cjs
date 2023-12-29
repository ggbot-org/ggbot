module.exports = {
	env: { browser: true, es2020: true, node: false },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-type-checked",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		project: ["./tsconfig.json", "./tsconfig.workers.json"],
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
		"@typescript-eslint/member-ordering": "error",
		"@typescript-eslint/no-array-constructor": "off",
		"@typescript-eslint/no-empty-function": "off",
		// Accept expressions like
		// type Output<Operation extends (...args: any[]) => Promise<unknown>> = Awaited<ReturnType<Operation>>
		"@typescript-eslint/no-explicit-any": [
			"warn",
			{ ignoreRestArgs: true }
		],
		"@typescript-eslint/no-extra-semi": "off",
		"@typescript-eslint/no-unsafe-argument": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
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
				varsIgnorePattern: "^_"
			}
		],
		// @typescript-eslint/unbound-method rule is not compatible with hooks,
		// it reports this as an error:
		// ```ts
		// const { formatMessage } = useIntl()
		// ```
		"@typescript-eslint/unbound-method": "off",
		"arrow-body-style": ["error", "as-needed"],
		"block-scoped-var": "error",
		"default-param-last": "error",
		"dot-notation": "error",
		eqeqeq: "error",
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
		"import/first": "error",
		"import/newline-after-import": "error",
		"import/no-cycle": "error",
		"import/no-extraneous-dependencies": ["error"],
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
		"no-console": ["error", { allow: ["error"] }],
		"no-extra-label": "warn",
		"no-floating-decimal": "error",
		"no-global-assign": "error",
		"no-implicit-coercion": "warn",
		"no-implicit-globals": "error",
		"no-lonely-if": "error",
		// Prettier uses tabs for indentation but can use spaces to align things, such as in ternaries.
		// This behavior is known as [SmartTabs](https://www.emacswiki.org/emacs/SmartTabs).
		"no-mixed-spaces-and-tabs": "off",
		"no-multi-assign": "error",
		"no-warning-comments": "warn",
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
		"react-hooks/exhaustive-deps": "error",
		"react-hooks/rules-of-hooks": "error",
		"simple-import-sort/exports": "error",
		"simple-import-sort/imports": "error",
		// TODO remove all switches then set it to error
		"smells/no-switch": "warn",
		"tsdoc/syntax": "error"
	},
	settings: {
		react: {
			version: "detect"
		}
	}
}
