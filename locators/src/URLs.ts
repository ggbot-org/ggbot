export class ApiAuthenticationEnterURL extends URL {
	constructor(apiBaseURL: string) {
		super("/enter", apiBaseURL)
	}
}

export class ApiAuthenticationVerifyURL extends URL {
	constructor(apiBaseURL: string) {
		super("/verify", apiBaseURL)
	}
}

export class ApiAdminActionURL extends URL {
	constructor(apiBaseURL: string) {
		super("/admin/action", apiBaseURL)
	}
}

export class ApiPublicActionURL extends URL {
	constructor(apiBaseURL: string) {
		super("/public/action", apiBaseURL)
	}
}

export class ApiUserActionURL extends URL {
	constructor(apiBaseURL: string) {
		super("/user/action", apiBaseURL)
	}
}

export class ApiStripeWebhookURL extends URL {
	constructor(apiBaseURL: string) {
		super("/stripe/webhook", apiBaseURL)
	}
}

export class ApiUtrustOrderURL extends URL {
	constructor(apiBaseURL: string) {
		super("/utrust/order", apiBaseURL)
	}
}

export class UtrustCancelURL extends URL {
	static htmlFileName = "purchase-canceled.html"
	constructor(userWebappBaseURL: string) {
		super(`/${UtrustCancelURL.htmlFileName}`, userWebappBaseURL)
	}
}

export class UtrustCallbackURL extends URL {
	constructor(apiBaseURL: string) {
		super("/utrust/callback", apiBaseURL)
	}
}

export class UtrustReturnURL extends URL {
	static htmlFileName = "subscription-purchased.html"
	constructor(userWebappBaseURL: string) {
		super(`/${UtrustReturnURL.htmlFileName}`, userWebappBaseURL)
	}
}
