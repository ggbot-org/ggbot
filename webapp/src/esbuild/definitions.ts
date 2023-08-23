import { DeployStage, ENV, isDev } from "@ggbot2/env"

const DEPLOY_STAGE = `"${ENV.DEPLOY_STAGE()}"` as DeployStage

export const esbuildDefinitions = {
	BUILD_DATE: `"${new Date().toJSON().substring(0, 10)}"`,
	IS_DEV: `${isDev}`,
	DEPLOY_STAGE,
	"process.env.DEPLOY_STAGE": `"${ENV.DEPLOY_STAGE()}"`,
	"process.env.DNS_DOMAIN": `"${ENV.DNS_DOMAIN()}"`
}
