import { DeployStage, isDeployStage } from "@workspace/models"

import { EnvironmentVariableName } from "./environmentVariableNames.js"

function getVariable(
	VARIABLE_VALUE: unknown,
	VARIABLE_NAME: EnvironmentVariableName,
	DEFAULT_VALUE?: string
) {
	if (typeof VARIABLE_VALUE === "string") return VARIABLE_VALUE
	if (DEFAULT_VALUE) {
		console.error(`Missing environment variable ${VARIABLE_NAME}, using default value ${DEFAULT_VALUE}`)
		return DEFAULT_VALUE
	}
	throw new Error(`Missing environment variable ${VARIABLE_NAME}`)
}

class EnvironmentVariables {
	get isDev() {
		return this.DEPLOY_STAGE() !== "main"
	}

	AUTHENTICATION_SECRET() {
		return getVariable(process.env.AUTHENTICATION_SECRET, "AUTHENTICATION_SECRET")
	}

	AWS_ACCOUNT_ID() {
		return getVariable(process.env.AWS_ACCOUNT_ID, "AWS_ACCOUNT_ID")
	}

	AWS_BINANCE_PROXY_REGION() {
		return getVariable(process.env.AWS_BINANCE_PROXY_REGION, "AWS_BINANCE_PROXY_REGION")
	}

	AWS_DATA_REGION() {
		return getVariable(process.env.AWS_DATA_REGION, "AWS_DATA_REGION")
	}

	AWS_SES_REGION() {
		return getVariable(process.env.AWS_SES_REGION, "AWS_SES_REGION")
	}

	BINANCE_PROXY_IP() {
		return getVariable(process.env.BINANCE_PROXY_IP, "BINANCE_PROXY_IP")
	}

	DEPLOY_STAGE(): DeployStage {
		const deployStage = getVariable(process.env.DEPLOY_STAGE, "DEPLOY_STAGE", "local")
		if (isDeployStage(deployStage)) return deployStage
		throw new Error(`Invalid DeployStage ${deployStage}`)
	}

	DNS_DOMAIN() {
		return getVariable(process.env.DNS_DOMAIN, "DNS_DOMAIN")
	}

	GITHUB_ORG_URL(defaultValue?: string) {
		return getVariable(process.env.GITHUB_ORG_URL, "GITHUB_ORG_URL", defaultValue)
	}

	PROJECT_SHORT_NAME() {
		return getVariable(process.env.PROJECT_SHORT_NAME, "PROJECT_SHORT_NAME", "project")
	}

	STRIPE_PLAN_BASIC_MONTHLY_PRICE(defaultValue?: string) {
		return getVariable(process.env.STRIPE_PLAN_BASIC_MONTHLY_PRICE, "STRIPE_PLAN_BASIC_MONTHLY_PRICE", defaultValue)
	}

	STRIPE_PLAN_BASIC_PRICE_ID() {
		return getVariable(process.env.STRIPE_PLAN_BASIC_PRICE_ID, "STRIPE_PLAN_BASIC_PRICE_ID")
	}

	STRIPE_SECRET_KEY() {
		return getVariable(process.env.STRIPE_SECRET_KEY, "STRIPE_SECRET_KEY")
	}

	TELEGRAM_SUPPORT_URL(defaultValue?: string) {
		return getVariable(process.env.TELEGRAM_SUPPORT_URL, "TELEGRAM_SUPPORT_URL", defaultValue)
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
