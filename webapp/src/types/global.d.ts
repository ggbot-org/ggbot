import { esbuildDefinitions } from "../esbuild/definitions"
import { LoggingController } from "../logging"

declare global {
	const BUILD_DATE: typeof esbuildDefinitions.BUILD_DATE
	const DEPLOY_STAGE: typeof esbuildDefinitions.DEPLOY_STAGE
	const DNS_DOMAIN: typeof esbuildDefinitions.DNS_DOMAIN
	const IS_DEV: typeof esbuildDefinitions.IS_DEV
	// To be able to use `globalThis.log`, it is needed to declare it as `var`
	// See: https://stackoverflow.com/a/69230938/1217468
	// eslint-disable-next-line no-var
	var log: LoggingController
}
