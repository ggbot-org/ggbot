import { FQDN } from "./FQDNs.js"

class AuthBaseURL extends URL {
	constructor(fqdn: FQDN) {
		super(`https://${fqdn.authDomain}`)
	}
}

const authEndpoint = {
	enter: "enter",
	verify: "verify"
}

export class AuthURLs {
	baseURL: AuthBaseURL

	constructor(
		deployStage: FQDN["deployStage"],
		dnsDomain: FQDN["dnsDomain"]
	) {
		this.baseURL = new AuthBaseURL(new FQDN(deployStage, dnsDomain))
	}

	get enter() {
		return new URL(authEndpoint.enter, this.baseURL)
	}

	get verify() {
		return new URL(authEndpoint.verify, this.baseURL)
	}
}
