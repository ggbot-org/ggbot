module.exports = {
	extends: [
		"@workspace/eslint-config",
		"plugin:@typescript-eslint/recommended-type-checked"
	],
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname
	},
	// TODO remove overrides
	rules: {
		"no-warning-comments": "warn"
	}
}
