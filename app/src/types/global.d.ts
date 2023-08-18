import { buildDefinitions } from "@ggbot2/esbuild"

declare global {
	const BUILD_DATE: typeof buildDefinitions.BUILD_DATE
	const DEPLOY_STAGE: typeof buildDefinitions.DEPLOY_STAGE
}
