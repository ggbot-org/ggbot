import { DeployStage } from "@workspace/models"

import { EnvironmentVariableName } from "./environmentVariableNames.js"
import { ErrorMissingEnvironmentVariable } from "./errors.js"

const getVariable = (VARIABLE_NAME: EnvironmentVariableName) => {
	const VALUE = process.env[VARIABLE_NAME]
	if (typeof VALUE === "string") return VALUE
	throw new ErrorMissingEnvironmentVariable(VARIABLE_NAME)
}

class EnvironmentVariables {
	get isDev() {
		return this.DEPLOY_STAGE() !== "main"
	}

	AUTHENTICATION_SECRET() {
		return getVariable("AUTHENTICATION_SECRET")
	}

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

	BINANCE_PROXY_IP() {
		return getVariable("BINANCE_PROXY_IP")
	}

	DEPLOY_STAGE(): DeployStage {
		return getVariable("DEPLOY_STAGE") as DeployStage
	}

	DNS_DOMAIN() {
		return getVariable("DNS_DOMAIN")
	}

	PROJECT_SHORT_NAME() {
		return getVariable("PROJECT_SHORT_NAME")
	}

	STRIPE_PLAN_BASIC_MONTHLY_PRICE() {
		return getVariable("STRIPE_PLAN_BASIC_MONTHLY_PRICE")
	}

	STRIPE_PLAN_BASIC_PRICE_ID() {
		return getVariable("STRIPE_PLAN_BASIC_PRICE_ID")
	}

	STRIPE_SECRET_KEY() {
		return getVariable("STRIPE_SECRET_KEY")
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
