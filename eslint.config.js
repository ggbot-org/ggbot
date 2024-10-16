import json from "@eslint/json"
import stylisticPlugin from "@stylistic/eslint-plugin"
import typeScriptEslintPlugin from "@typescript-eslint/eslint-plugin"
import typeScriptParser from "@typescript-eslint/parser"
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort"
import tsdoc from "eslint-plugin-tsdoc"
import workspaces from "eslint-plugin-workspaces"

// An ignores key used without any other keys acts as global ignores.
const globalIgnores = {
	ignores: [
		"*/dist/",
		"*/temp/",
		"webapp/public/**/*.js",
	]
}

const simpleImportSortRules = {
	"simple-import-sort/exports": "error",
	"simple-import-sort/imports": "error",
}

const stylisticRules = {
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
	"@stylistic/implicit-arrow-linebreak": "error",
	"@stylistic/indent": ["error", "tab"],
	"@stylistic/key-spacing": "error",
	"@stylistic/keyword-spacing": "error",
	"@stylistic/no-extra-semi": "error",
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
	"@stylistic/padded-blocks": ["error", "never"],
	"@stylistic/quotes": ["error", "double", { "avoidEscape": true }],
	"@stylistic/semi": ["error", "never"],
	"@stylistic/space-in-parens": ["error", "never"],
	"@stylistic/space-infix-ops": "error",
	"@stylistic/space-unary-ops": "error",
	"@stylistic/template-tag-spacing": "error",
	"@stylistic/type-annotation-spacing": "error",
	"@stylistic/type-generic-spacing": "error",
	"@stylistic/type-named-tuple-spacing": "error",
}

const stylisticJsxRules = {
	"@stylistic/jsx-closing-bracket-location": "error",
	"@stylistic/jsx-closing-tag-location": "error",
	"@stylistic/jsx-curly-brace-presence": ["error", { children: "never", propElementValues: "always", props: "never" }],
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
}

const tsconfigFiles = ["**/tsconfig*.json", "tsconfig/default.json", "tsconfig/lambda.json"]

export default [
	globalIgnores,
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parser: typeScriptParser,
		},
		plugins: {
			"@stylistic": stylisticPlugin,
			"@typescript-eslint": typeScriptEslintPlugin,
			"simple-import-sort": simpleImportSortPlugin,
			tsdoc,
			workspaces
		},
		rules: {
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

			"no-case-declarations": "error",
			"no-console": ["error", { allow: ["debug", "error", "info", "warn"] }],

			"tsdoc/syntax": "error",

			"workspaces/require-dependency": "error",

			...simpleImportSortRules,
			...stylisticRules,
			...stylisticJsxRules,
		}
	},

	{
		files: ["eslint.config.js"],
		plugins: {
			"@stylistic": stylisticPlugin,
			"simple-import-sort": simpleImportSortPlugin,
		},
		rules: {
			"sort-keys": "error",
			...simpleImportSortRules,
			...stylisticRules,
		}
	},

	// JSON files.
	{
		files: ["**/*.json"],
		ignores: ["package-lock.json", ...tsconfigFiles],
		language: "json/json",
		...json.configs.recommended,
	},
	{
		files: tsconfigFiles,
		language: "json/jsonc",
		plugins: { json },
		...json.configs.recommended,
	},
]
