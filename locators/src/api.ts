import { FQDN } from "./FQDNs.js"

class ApiBaseURL extends URL {
	constructor(fqdn: FQDN) {
		super(`https://${fqdn.apiDomain}`)
	}
}

const ApiEndpoint = {
	admin: {
		action: "admin/action"
	},
	public: {
		action: "public/action"
	},
	stripe: {
		webhook: "stripe/webhook"
	},
	user: {
		action: "user/action"
	}
}

export class ApiURLs {
	baseURL: ApiBaseURL

	constructor(
		deployStage: FQDN["deployStage"],
		dnsDomain: FQDN["dnsDomain"]
	) {
		this.baseURL = new ApiBaseURL(new FQDN(deployStage, dnsDomain))
	}

	get admin() {
		const { baseURL } = this
		return {
			get action() {
				return new URL(ApiEndpoint.admin.action, baseURL)
			}
		}
	}

	get public() {
		const { baseURL } = this
		return {
			get action() {
				return new URL(ApiEndpoint.public.action, baseURL)
			}
		}
	}

	get stripe() {
		const { baseURL } = this
		return {
			get webhook() {
				return new URL(ApiEndpoint.stripe.webhook, baseURL)
			}
		}
	}

	get user() {
		const { baseURL } = this
		return {
			get action() {
				return new URL(ApiEndpoint.user.action, baseURL)
			}
		}
	}
}
