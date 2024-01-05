import { StrategyKey } from "@workspace/models"

import { FQDN } from "./FQDNs.js"

export class WebappBaseURL extends URL {
	constructor(fqdn: FQDN) {
		super(
			fqdn.deployStage === "local"
				? "http://localhost:8000"
				: `https://${fqdn.webappDomain}`
		)
	}
}

const WebappDirname = {
	user: "user"
} as const

const WebappPagePathname = {
	homepage: "index.html",
	privacy: "privacy.html",
	terms: "terms.html",
	strategy: "strategy.html",
	purchaseCanceled: "purchase-canceled.html",
	subscriptionPurchased: "subscription-purchased.html",
	user: {
		copyStrategy: `${WebappDirname.user}/copy-strategy.html`,
		dashboard: `${WebappDirname.user}/dashboard.html`,
		settings: {
			account: `${WebappDirname.user}/account-settings.html`,
			billing: `${WebappDirname.user}/billing-settings.html`,
			binance: `${WebappDirname.user}/binance-settings.html`
		},
		strategy: `${WebappDirname.user}/strategy.html`
	}
} as const

const appendStrategyKeyToURLSearchParams = (
	{ strategyId, strategyKind }: StrategyKey,
	url: URL
) => {
	url.searchParams.append("strategyId", strategyId)
	url.searchParams.append("strategyKind", strategyKind)
	return url
}

/**
 * Defines webapp URLs.
 *
 * @example
 *
 * ```ts
 * const webapp = new WebappURLs("main", "example.com")
 *
 * window.open(webapp.homepage)
 * ```
 */
export class WebappURLs {
	baseURL: WebappBaseURL

	constructor(
		deployStage: FQDN["deployStage"],
		dnsDomain: FQDN["dnsDomain"]
	) {
		this.baseURL = new WebappBaseURL(new FQDN(deployStage, dnsDomain))
	}

	get homepage() {
		return new URL(WebappPagePathname.homepage, this.baseURL)
	}

	get privacy() {
		return new URL(WebappPagePathname.privacy, this.baseURL)
	}

	get terms() {
		return new URL(WebappPagePathname.terms, this.baseURL)
	}

	get user() {
		const { baseURL } = this
		return {
			get dashboard() {
				return new URL(WebappPagePathname.user.dashboard, baseURL)
			},
			copyStrategy(strategyKey: StrategyKey) {
				return appendStrategyKeyToURLSearchParams(
					strategyKey,
					new URL(WebappPagePathname.user.copyStrategy, baseURL)
				)
			},
			strategy(strategyKey: StrategyKey) {
				return appendStrategyKeyToURLSearchParams(
					strategyKey,
					new URL(WebappPagePathname.user.strategy, baseURL)
				)
			}
		}
	}

	strategy(strategyKey: StrategyKey) {
		return appendStrategyKeyToURLSearchParams(
			strategyKey,
			new URL(WebappPagePathname.strategy, this.baseURL)
		)
	}
}
