import { DeployStage } from "@workspace/models"

import { ErrorMissingEnvironmentVariable } from "./errors.js"

// Use explicit `process.env.VARIABLE` expressions in order to make it visible to esbuild.
//
// For example
//
// ```ts
// const VALUE = process.env.DEPLOY_STAGE
// ```

export class EnvironmentVariables {
	DEPLOY_STAGE(): DeployStage {
		const VALUE = process.env.DEPLOY_STAGE
		if (VALUE === "main") return "main"
		if (VALUE === "next") return "next"
		if (VALUE === "local") return "local"
		throw new ErrorMissingEnvironmentVariable("DEPLOY_STAGE")
	}

	DNS_DOMAIN() {
		const VALUE = process.env.DNS_DOMAIN
		if (typeof VALUE === "string") return VALUE
		throw new ErrorMissingEnvironmentVariable("DNS_DOMAIN")
	}

	PROJECT_SHORT_NAME() {
		const VALUE = process.env.PROJECT_SHORT_NAME
		if (typeof VALUE === "string") return VALUE
		throw new ErrorMissingEnvironmentVariable("PROJECT_SHORT_NAME")
	}

	STRIPE_PLAN_BASIC_MONTHLY_PRICE() {
		const VALUE = process.env.STRIPE_PLAN_BASIC_MONTHLY_PRICE
		if (typeof VALUE === "string") return VALUE
		throw new ErrorMissingEnvironmentVariable(
			"STRIPE_PLAN_BASIC_MONTHLY_PRICE"
		)
	}
}
