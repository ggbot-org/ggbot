import { DeployStage } from './DeployStage'

declare class EnvironmentVariables {
	get isDev(): boolean
	AUTHENTICATION_SECRET(): string
	AWS_ACCOUNT_ID(): string
	AWS_BINANCE_PROXY_REGION(): string
	AWS_DATA_REGION(): string
	AWS_SES_REGION(): string
	BINANCE_PROXY_IP(): string
	DEPLOY_STAGE(): DeployStage
	DNS_DOMAIN(): string
	GITHUB_ORG_URL(defaultValue?: string): string
	PROJECT_SHORT_NAME(): string
	PROJECT_TAG_LINE(): string
	STRIPE_PLAN_BASIC_MONTHLY_PRICE(defaultValue?: string): string
	STRIPE_PLAN_BASIC_PRICE_ID(): string
	STRIPE_SECRET_KEY(): string
	TELEGRAM_SUPPORT_URL(defaultValue?: string): string
}

/**
 * Environment variables.
 * @example
 * Get the deploy stage:
 * ```ts
 * import { ENV } from "@workspace/env"
 *
 * console.info("DeployStage", ENV.DEPLOY_STAGE())
 * ```
 */
export declare const ENV: EnvironmentVariables
