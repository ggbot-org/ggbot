export default {
	extends: 'stylelint-config-standard-scss',
	rules: {
		'scss/load-no-partial-leading-underscore': null,
		// Match [BEM](https://en.bem.info) selectors.
		// Credits: https://github.com/humanmade/coding-standards/issues/193#issuecomment-1405099508
		'selector-class-pattern': [
			'^[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$',
			{
				resolveNestedSelectors: true,
				message: function expected(selectorValue) {
					return `Expected class selector "${selectorValue}" to match BEM CSS pattern`
				},
			},
		],
	},
}
