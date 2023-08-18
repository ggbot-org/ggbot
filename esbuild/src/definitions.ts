import { DeployStage, ENV } from "@ggbot2/env"
import { today } from "@ggbot2/time"

const DEPLOY_STAGE = `"${ENV.DEPLOY_STAGE()}"` as DeployStage

export const buildDefinitions = {
	BUILD_DATE: `"${today()}"`,
	DEPLOY_STAGE,
	"process.env.DEPLOY_STAGE": `"${ENV.DEPLOY_STAGE()}"`
}
