import { esbuildDefinitions } from "../esbuild/definitions"

declare global {
	const BUILD_DATE: typeof esbuildDefinitions.BUILD_DATE
	const DEPLOY_STAGE: typeof esbuildDefinitions.DEPLOY_STAGE
	const DNS_DOMAIN: typeof esbuildDefinitions.DNS_DOMAIN
	const IS_DEV: typeof esbuildDefinitions.IS_DEV
}
