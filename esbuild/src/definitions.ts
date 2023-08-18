import { DeployStage, ENV } from "@ggbot2/env"

const DEPLOY_STAGE = `"${ENV.DEPLOY_STAGE()}"` as DeployStage

export const buildDefinitions = {
	BUILD_DATE: `"${new Date().toJSON().substring(0, 10)}"`,
	DEPLOY_STAGE,
	"process.env.DEPLOY_STAGE": `"${ENV.DEPLOY_STAGE()}"`
}
