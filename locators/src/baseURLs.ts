import { FQDN } from "./FQDNs.js"

export class ApiBaseURL extends URL {
	constructor(fqdn: FQDN) {
		super(`https://${fqdn.apiDomain}`)
	}
}

export class AuthBaseURL extends URL {
	constructor(fqdn: FQDN) {
		super(`https://${fqdn.authDomain}`)
	}
}
