module.exports = {
	env: { browser: true, es2020: true, node: true },
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	plugins: [
		"@typescript-eslint",
		"eslint-plugin-tsdoc",
		"import",
		"simple-import-sort"
	],
	root: true,
	rules: {
		"@typescript-eslint/array-type": ["error", { default: "array-simple" }],
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
		"arrow-body-style": ["error", "as-needed"],
		"block-scoped-var": "error",
		"default-param-last": "error",
		"dot-notation": "error",
		eqeqeq: "error",
		"func-style": ["warn", "expression"],
		"import/extensions": ["error", "ignorePackages"],
		"import/first": "error",
		"import/newline-after-import": "error",
		"import/no-cycle": "error",
		"import/no-extraneous-dependencies": ["error"],
		"import/no-internal-modules": ["error"],
		"max-depth": ["error", 5],
		"no-case-declarations": "error",
		"no-console": ["error", { allow: ["error", "info", "warn"] }],
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
		"simple-import-sort/exports": "error",
		"simple-import-sort/imports": "error",
		"tsdoc/syntax": "error"
	}
}
