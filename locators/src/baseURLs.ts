import type { DeployStage } from "@ggbot2/env"

import {
	adminWebappDomain,
	adminWebappNextDomain,
	apiDomain,
	apiLocalDomain,
	apiNextDomain,
	authDomain,
	authLocalDomain,
	authNextDomain,
	userWebappDomain,
	userWebappNextDomain
} from "./FQDNs.js"

export class AdminWebappBaseURL extends URL {
	constructor(deployStage: DeployStage) {
		super(
			deployStage === "main"
				? `https://${adminWebappDomain}`
				: deployStage === "next"
				? `https://${adminWebappNextDomain}`
				: "http://localhost:8000"
		)
	}
}

export class ApiBaseURL extends URL {
	constructor(deployStage: DeployStage) {
		super(
			deployStage === "main"
				? `https://${apiDomain}`
				: deployStage === "next"
				? `https://${apiNextDomain}`
				: `https://${apiLocalDomain}`
		)
	}
}

export class AuthBaseURL extends URL {
	constructor(deployStage: DeployStage) {
		super(
			deployStage === "main"
				? `https://${authDomain}`
				: deployStage === "next"
				? `https://${authNextDomain}`
				: `https://${authLocalDomain}`
		)
	}
}

export class UserWebappBaseURL extends URL {
	constructor(deployStage: DeployStage) {
		super(
			deployStage === "main"
				? `https://${userWebappDomain}`
				: deployStage === "next"
				? `https://${userWebappNextDomain}`
				: "http://localhost:8000"
		)
	}
}
