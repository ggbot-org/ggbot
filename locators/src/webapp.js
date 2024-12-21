export class WebappBaseURL extends URL {
	constructor(fqdn) {
		super(
			fqdn.deployStage === 'local'
				? 'http://localhost:8000'
				: `https://${fqdn.webappDomain}`
		)
	}
}

export const webappDirname = {
	admin: 'admin',
	design: 'design',
	user: 'user'
}

export const webappPagePathname = {
	homepage: 'index.html',
	privacy: 'privacy.html',
	terms: 'terms.html',
	strategy: 'strategy.html',
	purchaseCanceled: 'purchase-canceled.html',
	subscriptionPurchased: 'subscription-purchased.html',
	user: {
		copyStrategy: `${webappDirname.user}/copy-strategy.html`,
		editStrategy: `${webappDirname.user}/edit-strategy.html`,
		dashboard: `${webappDirname.user}/dashboard.html`,
		settings: `${webappDirname.user}/settings.html`,
		strategy: `${webappDirname.user}/strategy.html`
	},
	admin: {
		accountDetails: `${webappDirname.admin}/account-details.html`,
		dashboard: `${webappDirname.admin}/dashboard.html`
	},
	design: { showcase: `${webappDirname.design}/showcase.html` }
}

function appendAccountKeyToURLSearchParams({ accountId }, url) {
	url.searchParams.append('accountId', accountId)
	return url
}

function appendStrategyKeyToURLSearchParams({ strategyId, strategyKind }, url) {
	url.searchParams.append('strategyId', strategyId)
	url.searchParams.append('strategyKind', strategyKind)
	return url
}

/**
 * Defines webapp URLs.
 *
 * @example
 *
 * ```ts
 * import { FQDN, WebappBaseURL	} from "@workspace/locators"
 *
 * const baseURL = new WebappBaseURL(new FQDN("main", "example.com"))
 * const webapp = new WebappURLs(baseURL)
 *
 * window.open(webapp.homepage)
 * ```
 */
export class WebappURLs {
	constructor(baseURL) {
		this.baseURL = baseURL
	}

	get homepage() {
		return new URL(webappPagePathname.homepage, this.baseURL)
	}

	get privacy() {
		return new URL(webappPagePathname.privacy, this.baseURL)
	}

	get terms() {
		return new URL(webappPagePathname.terms, this.baseURL)
	}

	get purchaseCanceled() {
		return new URL(webappPagePathname.purchaseCanceled, this.baseURL)
	}

	get subscriptionPurchased() {
		return new URL(webappPagePathname.subscriptionPurchased, this.baseURL)
	}

	get admin() {
		const { baseURL } = this
		return {
			accountDetails(accountKey) {
				return appendAccountKeyToURLSearchParams(
					accountKey, new URL(webappPagePathname.admin.accountDetails, baseURL)
				)
			},
			get dashboard() {
				return new URL(webappPagePathname.admin.dashboard, baseURL)
			}
		}
	}

	get design() {
		const { baseURL } = this
		return {
			get showcase() {
				return new URL(webappPagePathname.design.showcase, baseURL)
			}
		}
	}

	get user() {
		const { baseURL } = this
		return {
			get dashboard() {
				return new URL(webappPagePathname.user.dashboard, baseURL)
			},
			copyStrategy(strategyKey) {
				return appendStrategyKeyToURLSearchParams(
					strategyKey, new URL(webappPagePathname.user.copyStrategy, baseURL)
				)
			},
			editStrategy(strategyKey) {
				return appendStrategyKeyToURLSearchParams(
					strategyKey, new URL(webappPagePathname.user.editStrategy, baseURL)
				)
			},
			get settings() {
				return new URL(webappPagePathname.user.settings, baseURL)
			},
			strategy(strategyKey) {
				return appendStrategyKeyToURLSearchParams(
					strategyKey, new URL(webappPagePathname.user.strategy, baseURL)
				)
			}
		}
	}

	strategy(strategyKey) {
		const url = new URL(webappPagePathname.strategy, this.baseURL)

		return strategyKey
			? appendStrategyKeyToURLSearchParams(strategyKey, url)
			: url
	}
}
