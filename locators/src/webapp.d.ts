import { AccountKey, StrategyKey } from '@workspace/models'

import { FQDN } from './FQDNs.js'
export declare class WebappBaseURL extends URL {
	constructor(fqdn: FQDN)
}
export declare const webappDirname: {
	readonly admin: 'admin';
	readonly design: 'design';
	readonly user: 'user';
}

export declare const webappPagePathname: {
	readonly homepage: 'index.html';
	readonly privacy: 'privacy.html';
	readonly terms: 'terms.html';
	readonly strategy: 'strategy.html';
	readonly purchaseCanceled: 'purchase-canceled.html';
	readonly subscriptionPurchased: 'subscription-purchased.html';
	readonly user: {
		readonly copyStrategy: 'user/copy-strategy.html';
		readonly editStrategy: 'user/edit-strategy.html';
		readonly dashboard: 'user/dashboard.html';
		readonly settings: 'user/settings.html';
		readonly strategy: 'user/strategy.html';
	};
	readonly admin: {
		readonly accountDetails: 'admin/account-details.html';
		readonly dashboard: 'admin/dashboard.html';
	};
	readonly design: {
		readonly showcase: 'design/showcase.html';
	};
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
export declare class WebappURLs {
	baseURL: string | URL
	constructor(baseURL: string | URL)
	get homepage(): URL
	get privacy(): URL
	get terms(): URL
	get purchaseCanceled(): URL
	get subscriptionPurchased(): URL
	get admin(): {
		accountDetails(accountKey: AccountKey): URL;
		readonly dashboard: URL;
	}
	get design(): {
		readonly showcase: URL;
	}
	get user(): {
		readonly dashboard: URL;
		copyStrategy(strategyKey: StrategyKey): URL;
		editStrategy(strategyKey: StrategyKey): URL;
		readonly settings: URL;
		strategy(strategyKey: StrategyKey): URL;
	}
	strategy(strategyKey?: StrategyKey): URL
}
