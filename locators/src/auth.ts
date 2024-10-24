import { FQDN } from "./FQDNs.js"

export class AuthURLs {
	baseURL: URL

	constructor(deployStage: FQDN["deployStage"], dnsDomain: FQDN["dnsDomain"]) {
		this.baseURL = new URL(new FQDN(deployStage, dnsDomain).authDomain)
	}

	get enter() {
		return new URL("enter", this.baseURL)
	}

	get verify() {
		return new URL("verify", this.baseURL)
	}
}
