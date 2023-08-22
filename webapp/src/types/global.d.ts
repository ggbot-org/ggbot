import { esbuildDefinitions } from "../esbuild/definitions.js"

declare global {
	const BUILD_DATE: typeof esbuildDefinitions.BUILD_DATE
	const DEPLOY_STAGE: typeof esbuildDefinitions.DEPLOY_STAGE
}
