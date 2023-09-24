import { DeployStage } from "@workspace/env"

import { ErrorMissingEnvironmentVariable } from "./errors.js"

export class EnvironmentVariables {
	DEPLOY_STAGE(): DeployStage {
		// Use explicit `process.env.DEPLOY_STAGE` in order to make it visible to esbuild.
		const VALUE = process.env.DEPLOY_STAGE
		if (VALUE === "main") return "main"
		if (VALUE === "next") return "next"
		if (VALUE === "local") return "local"
		throw new ErrorMissingEnvironmentVariable("DEPLOY_STAGE")
	}

	DNS_DOMAIN() {
		// Use explicit `process.env.DEPLOY_STAGE` in order to make it visible to esbuild.
		const VALUE = process.env.DNS_DOMAIN
		if (typeof VALUE === "string") return VALUE
		throw new ErrorMissingEnvironmentVariable("DNS_DOMAIN")
	}
}
