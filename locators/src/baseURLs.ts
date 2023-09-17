import { FQDN } from "./FQDNs.js"

export class ApiBaseURL extends URL {
	constructor(fqdn: FQDN) {
		super(fqdn.apiDomain)
	}
}

export class AuthBaseURL extends URL {
	constructor(fqdn: FQDN) {
		super(fqdn.apiDomain)
	}
}

export class WebappBaseURL extends URL {
	constructor(fqdn: FQDN) {
		super(
			fqdn.deployStage === "local"
				? "http://localhost:8000"
				: fqdn.webappDomain
		)
	}
}
