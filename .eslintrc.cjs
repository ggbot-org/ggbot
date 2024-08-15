module.exports = {
	env: { browser: false, es2020: true, node: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/strict"
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
		"@stylistic/array-bracket-newline": ["error", "consistent"],
		"@stylistic/array-bracket-spacing": "error",
		"@stylistic/array-element-newline": ["error", { "consistent": true, "multiline": true }],
		"@stylistic/arrow-parens": ["error", "always"],
		"@stylistic/arrow-spacing": "error",
		"@stylistic/block-spacing": "error",
		"@stylistic/brace-style": "error",
		"@stylistic/comma-dangle": ["error", "only-multiline"],
		"@stylistic/comma-spacing": "error",
		"@stylistic/comma-style": "error",
		"@stylistic/computed-property-spacing": "error",
		"@stylistic/function-call-argument-newline": ["error", "consistent"],
		"@stylistic/function-call-spacing": "error",
		"@stylistic/indent": ["error", "tab"],
		"@stylistic/implicit-arrow-linebreak": "error",
		"@stylistic/padded-blocks": ["error", "never"],
		"@stylistic/space-infix-ops": "error",
		"@stylistic/type-annotation-spacing": "error",
		"@stylistic/key-spacing": "error",
		"@stylistic/keyword-spacing": "error",
		"@stylistic/no-extra-semi": "error",
		"@typescript-eslint/no-invalid-this": "error",
		"@stylistic/no-mixed-spaces-and-tabs": "error",
		"@stylistic/no-multi-spaces": "error",
		"@stylistic/no-multiple-empty-lines": ["error", { "max": 1 }],
		"@stylistic/no-trailing-spaces": "error",
		"@stylistic/no-whitespace-before-property": "error",
		"@stylistic/nonblock-statement-body-position": "error",
		"@stylistic/object-curly-newline": ["error",
			{
				"ExportDeclaration": "never",
				"ImportDeclaration": "never",
				"ObjectExpression": { "consistent": true },
				"ObjectPattern": { "consistent": true },
			}],
		"@stylistic/object-curly-spacing": ["error", "always"],
		"@stylistic/quotes": ["error", "double", { "avoidEscape": true }],
		"@stylistic/semi": ["error", "never"],
		"@stylistic/space-in-parens": ["error", "never"],
		"@stylistic/space-unary-ops": "error",
		"@stylistic/template-tag-spacing": "error",
		"@stylistic/type-generic-spacing": "error",
		"@stylistic/type-named-tuple-spacing": "error",

		"@typescript-eslint/array-type": ["error", { default: "array-simple" }],
		"@typescript-eslint/member-ordering": "error",
		"@typescript-eslint/no-dynamic-delete": "off",
		"@typescript-eslint/no-empty-function": "error",
		// Accept expressions like
		// ```ts
		// type Output<Operation extends (...args: any[]) => Promise<unknown>> = Awaited<ReturnType<Operation>>
		// ```
		"@typescript-eslint/no-explicit-any": ["error", { ignoreRestArgs: true }],
		"@typescript-eslint/no-inferrable-types": "error",
		"@typescript-eslint/no-invalid-void-type": "off",
		"@typescript-eslint/no-unused-vars": ["error",
			{
				// Follow the TypeScript convention to prepend an underscore to ignore when a variable is not used.
				// This works also with TypeScript compiler options:
				// ```json
				// "noUnusedLocals": true,
				// "noUnusedParameters": true,
				// ```
				argsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_",
				destructuredArrayIgnorePattern: "^_",
				varsIgnorePattern: "^_"
			}],
		"@typescript-eslint/prefer-for-of": "error",
		"@typescript-eslint/no-useless-empty-export": "error",

		"arrow-body-style": ["error", "as-needed"],
		"block-scoped-var": "error",
		"default-param-last": "error",
		"dot-notation": "error",
		eqeqeq: ["error", "smart"],

		"import/extensions": ["error", "ignorePackages"],
		"import/first": "error",
		"import/newline-after-import": "error",
		"import/no-cycle": "error",
		"import/no-extraneous-dependencies": "error",

		"no-case-declarations": "error",
		"no-console": ["error", { allow: ["debug"] }],
		"no-extra-label": "error",
		// Turn off no-extra-semi, in favour of @stylistic/no-extra-semi
		"no-extra-semi": "off",
		"no-floating-decimal": "error",
		"no-global-assign": "error",
		"no-implicit-coercion": "error",
		"no-implicit-globals": "error",
		// Turn off no-invalid-this, in favour of @stylistic/no-invalid-this
		"no-invalid-this": "off",
		"no-lonely-if": "error",
		"no-multi-assign": "error",
		// TODO set no-warning-comments to "warn"
		"no-warning-comments": "off",

		"simple-import-sort/exports": "error",
		"simple-import-sort/imports": "error",

		"smells/no-switch": "error",
		"tsdoc/syntax": "error",

		"workspaces/require-dependency": "error"
	}
}
