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

export class WebappBaseURL extends URL {
	constructor(fqdn: FQDN) {
		super(
			fqdn.deployStage === "local"
				? "http://localhost:8000"
				: `https://${fqdn.webappDomain}`
		)
	}
}
