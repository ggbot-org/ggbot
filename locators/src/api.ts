import { FQDN } from "./FQDNs.js"

export class ApiURLs {
	baseURL: URL

	constructor(deployStage: FQDN["deployStage"], dnsDomain: FQDN["dnsDomain"]) {
		this.baseURL = new URL(`https://${new FQDN(deployStage, dnsDomain).apiDomain}`)
	}

	get admin() {
		const { baseURL } = this
		return {
			get action() {
				return new URL("admin/action", baseURL)
			}
		}
	}

	get public() {
		const { baseURL } = this
		return {
			get action() {
				return new URL("public/action", baseURL)
			}
		}
	}

	get stripe() {
		const { baseURL } = this
		return {
			get action() {
				return new URL("stripe/action", baseURL)
			},
			get webhook() {
				return new URL("stripe/webhook", baseURL)
			},
		}
	}

	get user() {
		const { baseURL } = this
		return {
			get action() {
				return new URL("user/action", baseURL)
			}
		}
	}
}
