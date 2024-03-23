import { FQDN } from "./FQDNs.js"

class ApiBaseURL extends URL {
	constructor(fqdn: FQDN) {
		super(`https://${fqdn.apiDomain}`)
	}
}

const apiEndpoint = {
	admin: {
		action: "admin/action"
	},
	public: {
		action: "public/action"
	},
	stripe: {
		action: "stripe/action",
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
				return new URL(apiEndpoint.admin.action, baseURL)
			}
		}
	}

	get public() {
		const { baseURL } = this
		return {
			get action() {
				return new URL(apiEndpoint.public.action, baseURL)
			}
		}
	}

	get stripe() {
		const { baseURL } = this
		return {
			get action() {
				return new URL(apiEndpoint.stripe.action, baseURL)
			},
			get webhook() {
				return new URL(apiEndpoint.stripe.webhook, baseURL)
			}
		}
	}

	get user() {
		const { baseURL } = this
		return {
			get action() {
				return new URL(apiEndpoint.user.action, baseURL)
			}
		}
	}
}
