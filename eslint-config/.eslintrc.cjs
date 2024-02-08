module.exports = {
	env: {
		node: true
	},
	extends: ["./base.cjs"],
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname
	}
}
