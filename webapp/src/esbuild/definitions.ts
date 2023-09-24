import { DeployStage } from "@workspace/env"

import { EnvironmentVariables } from "./EnvironmentVariables.js"

const ENV = new EnvironmentVariables()

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()
const isDev = DEPLOY_STAGE !== "main"

export const esbuildDefinitions = {
	BUILD_DATE: `"${new Date().toJSON().substring(0, 10)}"`,
	DEPLOY_STAGE: `"${DEPLOY_STAGE}"` as DeployStage,
	DNS_DOMAIN: `"${ENV.DNS_DOMAIN()}"`,
	IS_DEV: `${isDev}`
}
