/* eslint-disable no-var */
import { esbuildDefinitions } from "_/esbuild/definitions"
import { LoggingController } from "_/logging"

declare global {
	const BUILD_DATE: typeof esbuildDefinitions.BUILD_DATE
	const DEPLOY_STAGE: typeof esbuildDefinitions.DEPLOY_STAGE
	const DNS_DOMAIN: typeof esbuildDefinitions.DNS_DOMAIN
	const IS_DEV: typeof esbuildDefinitions.IS_DEV
	const STRIPE_PLAN_BASIC_MONTHLY_PRICE: typeof esbuildDefinitions.STRIPE_PLAN_BASIC_MONTHLY_PRICE

	namespace globalThis {
		var log: LoggingController
	}
}
