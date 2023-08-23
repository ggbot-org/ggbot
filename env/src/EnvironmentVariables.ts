import { EnvironmentVariableName } from "./environmentVariableNames.js"
import { ErrorMissingEnvironmentVariable } from "./errors.js"

export type DeployStage = "main" | "next" | "local"
export type NodeEnv = "development" | "production"

const getVariable = (VARIABLE_NAME: EnvironmentVariableName) => {
	const VALUE = process.env[VARIABLE_NAME]
	if (typeof VALUE === "string") return VALUE
	throw new ErrorMissingEnvironmentVariable(VARIABLE_NAME)
}

class EnvironmentVariables {
	AWS_ACCOUNT_ID() {
		return getVariable("AWS_ACCOUNT_ID")
	}

	BINANCE_PROXY_BASE_URL() {
		return getVariable("BINANCE_PROXY_BASE_URL")
	}

	DEPLOY_STAGE(): DeployStage {
		// Use explicit `process.env.DEPLOY_STAGE` in order to make it visible to JS bundlers.
		const VALUE = process.env.DEPLOY_STAGE
		if (VALUE === "main") return "main"
		if (VALUE === "next") return "next"
		if (VALUE === "local") return "local"
		throw new ErrorMissingEnvironmentVariable("DEPLOY_STAGE")
	}

	DNS_DOMAIN() {
		// Use explicit `process.env.DEPLOY_STAGE` in order to make it visible to JS bundlers.
		const VALUE = process.env.DNS_DOMAIN
		if (typeof VALUE === "string") return VALUE
		throw new ErrorMissingEnvironmentVariable("DNS_DOMAIN")
	}

	JWT_SECRET() {
		return getVariable("JWT_SECRET")
	}

	NODE_ENV(): NodeEnv {
		const VARIABLE_NAME: EnvironmentVariableName = "NODE_ENV"
		const VALUE = process.env[VARIABLE_NAME]
		if (VALUE === "production") return "production"
		return "development"
	}

	UTRUST_API_KEY() {
		return getVariable("UTRUST_API_KEY")
	}

	UTRUST_WEBHOOK_SECRET() {
		return getVariable("UTRUST_WEBHOOK_SECRET")
	}
}

/**
 * Environment variables.
 *
 * @example
 *
 * ```ts
 * import { ENV } from "@ggbot2/env"
 *
 * console.info("DeployStage", ENV.DEPLOY_STAGE())
 * ```
 */
export const ENV = new EnvironmentVariables()

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()
export const isDev = DEPLOY_STAGE !== "main"
