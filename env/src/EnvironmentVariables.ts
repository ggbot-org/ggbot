import { DeployStage } from "@workspace/models"

import { EnvironmentVariableName } from "./environmentVariableNames.js"
import { ErrorMissingEnvironmentVariable } from "./errors.js"

const getVariable = (VARIABLE_NAME: EnvironmentVariableName) => {
	const VALUE = process.env[VARIABLE_NAME]
	if (typeof VALUE === "string") return VALUE
	throw new ErrorMissingEnvironmentVariable(VARIABLE_NAME)
}

class EnvironmentVariables {
	AWS_ACCOUNT_ID() {
		return getVariable("AWS_ACCOUNT_ID")
	}

	AWS_BINANCE_PROXY_REGION() {
		return getVariable("AWS_BINANCE_PROXY_REGION")
	}

	AWS_DATA_REGION() {
		return getVariable("AWS_DATA_REGION")
	}

	AWS_SES_REGION() {
		return getVariable("AWS_SES_REGION")
	}

	BINANCE_PROXY_BASE_URL() {
		return getVariable("BINANCE_PROXY_BASE_URL")
	}

	BINANCE_PROXY_ELASTIC_IPS() {
		return getVariable("BINANCE_PROXY_ELASTIC_IPS")
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

	PROJECT_SHORT_NAME() {
		return getVariable("PROJECT_SHORT_NAME")
	}

	STRIPE_SECRET_KEY() {
		return getVariable("STRIPE_SECRET_KEY")
	}

	STRIPE_WEBHOOK_SECRET() {
		return getVariable("STRIPE_WEBHOOK_SECRET")
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
