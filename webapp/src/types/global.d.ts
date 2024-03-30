import { esbuildDefinitions } from "_/esbuild/definitions"

declare global {
	const BUILD_DATE: typeof esbuildDefinitions.BUILD_DATE
	const DEPLOY_STAGE: typeof esbuildDefinitions.DEPLOY_STAGE
	const DNS_DOMAIN: typeof esbuildDefinitions.DNS_DOMAIN
	const PROJECT_SHORT_NAME: typeof esbuildDefinitions.PROJECT_SHORT_NAME
	const STRIPE_PLAN_BASIC_MONTHLY_PRICE: typeof esbuildDefinitions.STRIPE_PLAN_BASIC_MONTHLY_PRICE
}
