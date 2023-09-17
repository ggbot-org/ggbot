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
		return getVariable("DEPLOY_STAGE") as DeployStage
	}

	DNS_DOMAIN() {
		return getVariable("DNS_DOMAIN")
	}

	JWT_SECRET() {
		return getVariable("JWT_SECRET")
	}

	NODE_ENV(): NodeEnv {
		const VALUE = getVariable("NODE_ENV")
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
 * import { ENV } from "@workspace/env"
 *
 * console.info("DeployStage", ENV.DEPLOY_STAGE())
 * ```
 */
export const ENV = new EnvironmentVariables()
