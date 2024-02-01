module.exports = {
	extends: [
		"@workspace/eslint-config",
		"plugin:@typescript-eslint/recommended-type-checked"
	],
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname
	},
	rules: {
		"no-console": "off"
	}
}
