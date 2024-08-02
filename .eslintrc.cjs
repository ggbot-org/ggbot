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
		"@stylistic",
		"@typescript-eslint",
		"eslint-plugin-tsdoc",
		"import",
		"simple-import-sort",
		"smells",
		"workspaces"
	],
	root: true,
	rules: {
		"@stylistic/array-element-newline": ["error", { "consistent": true, "multiline": true }],
		"@stylistic/arrow-parens": ["error", "always"],
		"@stylistic/arrow-spacing": "error",
		"@stylistic/brace-style": "error",
		"@stylistic/comma-spacing": "error",
		"@stylistic/computed-property-spacing": "error",
		"@stylistic/function-call-argument-newline": ["error", "consistent"],
		"@stylistic/function-call-spacing": ["error", "never"],
		"@stylistic/indent": ["error", "tab"],
		"@stylistic/implicit-arrow-linebreak": "error",
		"@stylistic/jsx-closing-bracket-location": "error",
		"@stylistic/jsx-closing-tag-location": "error",
		"@stylistic/jsx-curly-spacing": "error",
		"@stylistic/jsx-equals-spacing": "error",
		"@stylistic/jsx-props-no-multi-spaces": "error",
		"@stylistic/jsx-quotes": ["error", "prefer-double"],
		"@stylistic/jsx-self-closing-comp": "error",
		"@stylistic/key-spacing": "error",
		"@stylistic/keyword-spacing": "error",
		"@stylistic/no-extra-semi": "error",
		"@stylistic/no-mixed-spaces-and-tabs": "error",
		"@stylistic/no-multi-spaces": "error",
		"@stylistic/no-multiple-empty-lines": ["error", { "max": 1 }],
		"@stylistic/no-trailing-spaces": "error",
		"@stylistic/no-whitespace-before-property": "error",
		"@stylistic/nonblock-statement-body-position": "error",
		"@stylistic/object-curly-newline": ["error", { "consistent": true }],
		"@stylistic/object-curly-spacing": ["error", "always"],
		"@stylistic/quotes": ["error", "double", { "avoidEscape": true }],
		"@stylistic/semi": ["error", "never"],
		"@stylistic/space-in-parens": ["error", "never"],
		"@stylistic/space-unary-ops": "error",
		"@stylistic/template-tag-spacing": "error",
		"@stylistic/type-generic-spacing": "error",
		"@typescript-eslint/array-type": ["error", { default: "array-simple" }],
		"@typescript-eslint/member-ordering": "error",
		"@typescript-eslint/no-dynamic-delete": "off",
		"@typescript-eslint/no-empty-function": "error",
		// Accept expressions like
		// type Output<Operation extends (...args: any[]) => Promise<unknown>> = Awaited<ReturnType<Operation>>
		"@typescript-eslint/no-explicit-any": [
			"error",
			{ ignoreRestArgs: true }
		],
		"@typescript-eslint/no-extra-semi": "off",
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
		"no-case-declarations": "error",
		"no-console": "error",
		"no-extra-label": "error",
		"no-extra-semi": "off",
		"no-floating-decimal": "error",
		"no-global-assign": "error",
		"no-implicit-coercion": "error",
		"no-implicit-globals": "error",
		"no-lonely-if": "error",
		"no-multi-assign": "error",
		// TODO set no-warning-comments to "warn"
		"no-warning-comments": "off",
		"simple-import-sort/exports": "error",
		"simple-import-sort/imports": "error",
		"smells/no-switch": "error",
		"tsdoc/syntax": "error",
		"workspaces/no-relative-imports": "off"
	}
}
