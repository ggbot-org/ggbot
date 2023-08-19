const base = require("./base.cjs")

module.exports = {
	env: { browser: true, es2020: true, node: false },
	extends: [
		...base.extends,
		"plugin:react/recommended",
		"plugin:react/jsx-runtime"
	],
	parser: base.parser,
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		}
	},
	plugins: [...base.plugins, "formatjs", "jsx-a11y", "react", "react-hooks"],
	root: true,
	rules: {
		...base.rules,
		"formatjs/enforce-placeholders": "error",
		"formatjs/no-literal-string-in-jsx": [
			"warn",
			{
				props: {
					include: [
						// check aria attributes that the screen reader announces.
						["*", "aria-{label,description,details,errormessage}"],
						// check placeholder and title attribute of all native DOM elements.
						["[a-z]*([a-z0-9])", "(placeholder|title)"],
						// check alt attribute of the img tag.
						["img", "alt"],
						// check other props that may contain literal strings
						["*", "header"],
						["*", "label"]
					]
				}
			}
		],
		"import/extensions": ["warn", "never"],
		"jsx-a11y/aria-props": "error",
		"jsx-a11y/aria-proptypes": "error",
		"jsx-a11y/aria-unsupported-elements": "error",
		"jsx-a11y/role-has-required-aria-props": "error",
		"react/display-name": "error",
		"react/hook-use-state": ["error", { allowDestructuredState: true }],
		"react/jsx-boolean-value": "error",
		"react/jsx-key": "error",
		"react/jsx-newline": ["error", { prevent: false }],
		"react/jsx-no-comment-textnodes": "error",
		"react/jsx-no-constructed-context-values": "error",
		"react/jsx-no-duplicate-props": "error",
		"react/jsx-no-leaked-render": "error",
		"react/jsx-no-useless-fragment": "error",
		"react/jsx-pascal-case": ["error", { allowLeadingUnderscore: true }],
		"react/jsx-sort-props": [
			"error",
			{
				noSortAlphabetically: true,
				reservedFirst: true,
				shorthandFirst: true
			}
		],
		"react/jsx-wrap-multilines": "error",
		"react/no-array-index-key": "error",
		"react/no-danger": "error",
		"react/no-deprecated": "error",
		"react/prop-types": "off",
		"react/self-closing-comp": ["error", { component: true, html: true }],
		"react-hooks/exhaustive-deps": "error",
		"react-hooks/rules-of-hooks": "error"
	},
	settings: {
		react: {
			version: "detect"
		}
	}
}
