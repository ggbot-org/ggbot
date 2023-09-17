import type { DeployStage } from "@workspace/env"

import {
	apiDomain,
	apiLocalDomain,
	apiNextDomain,
	authDomain,
	authLocalDomain,
	authNextDomain,
	webappDomain,
	webappNextDomain
} from "./FQDNs.js"

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

export class WebappBaseURL extends URL {
	constructor(deployStage: DeployStage) {
		super(
			deployStage === "main"
				? `https://${webappDomain}`
				: deployStage === "next"
				? `https://${webappNextDomain}`
				: "http://localhost:8000"
		)
	}
}
