import { DeployStage } from '@workspace/models'

import { FQDN } from './FQDNs.js'

export class ApiURLs {
	baseURL: URL

	constructor(deployStage: DeployStage, dnsDomain: string) {
		this.baseURL = new URL(`https://${new FQDN(deployStage, dnsDomain).apiDomain}`)
	}

	get auth() {
		return new URL('auth', this.baseURL)
	}

	get admin() {
		return new URL('admin', this.baseURL)
	}

	get public() {
		return new URL('public', this.baseURL)
	}

	get stripe() {
		const { baseURL } = this
		return {
			get action() {
				return new URL('stripe/action', baseURL)
			},
			get webhook() {
				return new URL('stripe/webhook', baseURL)
			},
		}
	}

	get user() {
		return new URL('user', this.baseURL)
	}
}
