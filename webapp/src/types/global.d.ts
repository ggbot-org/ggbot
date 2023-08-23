import { esbuildDefinitions } from "../esbuild/definitions.js"

declare global {
	const BUILD_DATE: typeof esbuildDefinitions.BUILD_DATE
	const IS_DEV: typeof esbuildDefinitions.IS_DEV
	const DEPLOY_STAGE: typeof esbuildDefinitions.DEPLOY_STAGE
}
