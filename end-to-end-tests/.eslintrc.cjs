module.exports = {
	extends: ["@workspace/eslint-config", "plugin:playwright/recommended"],
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname
	}
}
