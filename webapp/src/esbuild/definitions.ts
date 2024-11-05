import { ENV } from "@workspace/env"
import { DeployStage } from "@workspace/models"

export const esbuildDefinitions = {
	BUILD_DATE: `"${new Date().toJSON().substring(0, 10)}"`,

	DEPLOY_STAGE: `"${ENV.DEPLOY_STAGE()}"` as DeployStage,
	"process.env.DEPLOY_STAGE": `"${ENV.DEPLOY_STAGE()}"` as DeployStage,

	DNS_DOMAIN: `"${ENV.DNS_DOMAIN()}"`,
	"process.env.DNS_DOMAIN": `"${ENV.DNS_DOMAIN()}"`,

	PROJECT_SHORT_NAME: `"${ENV.PROJECT_SHORT_NAME()}"`,
	STRIPE_PLAN_BASIC_MONTHLY_PRICE: `"${ENV.STRIPE_PLAN_BASIC_MONTHLY_PRICE("1")}"`,

	// Social links.
	"process.env.GITHUB_ORG_URL": `"${ENV.GITHUB_ORG_URL("https://github.com")}"`,
	"process.env.TELEGRAM_SUPPORT_URL": `"${ENV.TELEGRAM_SUPPORT_URL("https://t.me")}"`,
}
