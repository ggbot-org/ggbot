/* eslint-disable no-var */
import { esbuildDefinitions } from "_/esbuild/definitions"
import { LoggingController } from "_/logging"

declare global {
	const BUILD_DATE: typeof esbuildDefinitions.BUILD_DATE
	const DEPLOY_STAGE: typeof esbuildDefinitions.DEPLOY_STAGE
	const DNS_DOMAIN: typeof esbuildDefinitions.DNS_DOMAIN
	const IS_DEV: typeof esbuildDefinitions.IS_DEV

	namespace globalThis {
		var log: LoggingController
	}
}
