import { DeployStage } from "@workspace/models"

import { EnvironmentVariables } from "./EnvironmentVariables.js"

const ENV = new EnvironmentVariables()

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()

export const esbuildDefinitions = {
	BUILD_DATE: `"${new Date().toJSON().substring(0, 10)}"`,
	DEPLOY_STAGE: `"${DEPLOY_STAGE}"` as DeployStage,
	DNS_DOMAIN: `"${ENV.DNS_DOMAIN()}"`,
	PROJECT_SHORT_NAME: `"${ENV.PROJECT_SHORT_NAME()}"`,
	STRIPE_PLAN_BASIC_MONTHLY_PRICE: `"${ENV.STRIPE_PLAN_BASIC_MONTHLY_PRICE()}"`
}
