import json from '@eslint/json'
import typeScriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import typeScriptParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import tsdoc from 'eslint-plugin-tsdoc'
import workspaces from 'eslint-plugin-workspaces'

// An ignores key used without any other keys acts as global ignores.
const globalIgnores = {
	ignores: ['*/dist/', '*/temp/', 'webapp/public/**/*.js'],
}

const simpleImportSortRules = {
	'simple-import-sort/exports': 'error',
	'simple-import-sort/imports': 'error',
}

const tsconfigFiles = [
	'**/tsconfig*.json',
	'tsconfig/default.json',
	'tsconfig/lambda.json',
]

export default [
	globalIgnores,

	// All TypeScript files.
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: { parser: typeScriptParser },
		plugins: {
			'@typescript-eslint': typeScriptEslintPlugin,
			'simple-import-sort': simpleImportSortPlugin,
			tsdoc,
			workspaces,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					// Follow the TypeScript convention to prepend an underscore to ignore when a variable is not used.
					// This works also with TypeScript compiler options:
					// ```json
					// "noUnusedLocals": true,
					// "noUnusedParameters": true,
					// ```
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],

			'no-case-declarations': 'error',
			'no-console': ['error', { allow: ['debug', 'error', 'info', 'warn'] }],
			'no-unreachable': 'error',

			'tsdoc/syntax': 'error',

			'workspaces/require-dependency': 'error',

			...simpleImportSortRules,
		},
	},

	// WebApp JSX files.
	{
		files: ['webapp/**/*.tsx'],
		languageOptions: {
			parser: typeScriptParser,
			parserOptions: { ecmaFeatures: { jsx: true } },
		},
		plugins: {
			react,
		},
		rules: {
			'react/display-name': 'error',
			'react/function-component-definition': [
				'error',
				{ namedComponents: 'function-declaration' },
			],
			'react/hook-use-state': ['error', { allowDestructuredState: true }],

			'react/jsx-boolean-value': 'error',
			'react/jsx-key': 'error',
			'react/jsx-newline': ['error', { prevent: true }],
			'react/jsx-no-comment-textnodes': 'error',
			'react/jsx-no-constructed-context-values': 'error',
			'react/jsx-no-duplicate-props': 'error',
			'react/jsx-no-leaked-render': 'error',
			'react/jsx-no-useless-fragment': 'error',
			'react/jsx-pascal-case': ['error', { allowLeadingUnderscore: true }],
			'react/jsx-sort-props': [
				'error',
				{
					noSortAlphabetically: true,
					reservedFirst: true,
					shorthandFirst: true,
				},
			],
			'react/jsx-wrap-multilines': 'error',

			'react/no-array-index-key': 'error',
			'react/no-danger': 'error',
			'react/no-deprecated': 'error',
			'react/prop-types': 'off',
			'react/self-closing-comp': ['error', { component: true, html: true }],
		},
		settings: {
			react: {
				version: '18',
			},
		},
	},

	// ESLint config.
	{
		files: ['eslint.config.js'],
		plugins: {
			'simple-import-sort': simpleImportSortPlugin,
		},
		rules: {
			'sort-keys': 'error',
			...simpleImportSortRules,
		},
	},

	// JSON files.
	{
		files: ['**/*.json'],
		ignores: ['package-lock.json', ...tsconfigFiles],
		language: 'json/json',
		...json.configs.recommended,
	},
	{
		files: tsconfigFiles,
		language: 'json/jsonc',
		plugins: { json },
		...json.configs.recommended,
	},
]
