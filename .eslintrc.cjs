module.exports = {
	env: { browser: false, es2020: true, node: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/strict",
		"plugin:workspaces/recommended"
	],
	ignorePatterns: ["dist", "temp"],
	parser: "@typescript-eslint/parser",
	plugins: [
		"@typescript-eslint",
		"eslint-plugin-tsdoc",
		"import",
		"simple-import-sort",
		"smells",
		"workspaces"
	],
	root: true,
	rules: {
		"@typescript-eslint/array-type": ["error", { default: "array-simple" }],
		"@typescript-eslint/member-ordering": "error",
		"@typescript-eslint/no-dynamic-delete": "off",
		"@typescript-eslint/no-empty-function": "error",
		// Accept expressions like
		// type Output<Operation extends (...args: any[]) => Promise<unknown>> = Awaited<ReturnType<Operation>>
		"@typescript-eslint/no-explicit-any": [
			"warn",
			{ ignoreRestArgs: true }
		],
		"@typescript-eslint/no-extra-semi": "warn",
		"@typescript-eslint/no-invalid-void-type": "off",
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
		"@typescript-eslint/no-useless-empty-export": "error",
		"@typescript-eslint/unbound-method": "off",
		"arrow-body-style": ["error", "as-needed"],
		"block-scoped-var": "error",
		"default-param-last": "error",
		"dot-notation": "error",
		eqeqeq: ["error", "smart"],
		// TODO "func-style": ["error", "declaration"],
		"import/extensions": ["error", "ignorePackages"],
		"import/first": "error",
		"import/newline-after-import": "error",
		"import/no-cycle": "error",
		"import/no-extraneous-dependencies": "error",
		"import/no-internal-modules": "error",
		"no-case-declarations": "error",
		"no-console": "error",
		"no-extra-label": "warn",
		"no-extra-semi": "off",
		"no-floating-decimal": "error",
		"no-global-assign": "error",
		"no-implicit-coercion": "warn",
		"no-implicit-globals": "error",
		"no-lonely-if": "error",
		// Prettier uses tabs for indentation but can use spaces to align things, such as in ternaries.
		// This behavior is known as [SmartTabs](https://www.emacswiki.org/emacs/SmartTabs).
		"no-mixed-spaces-and-tabs": "off",
		"no-multi-assign": "error",
		// TODO se no-warning-comments to "warn"
		"no-warning-comments": "off",
		"simple-import-sort/exports": "error",
		"simple-import-sort/imports": "error",
		"smells/no-switch": "error",
		"tsdoc/syntax": "error",
		"workspaces/no-relative-imports": "off"
	}
}
