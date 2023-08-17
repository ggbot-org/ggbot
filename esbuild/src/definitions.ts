import { ENV } from "@ggbot2/env"
import { today } from "@ggbot2/time"

export const buildDefinitions = {
	BUILD_DATE: `"${today()}"`,
	"process.env.DEPLOY_STAGE": `"${ENV.DEPLOY_STAGE()}"`
}
