const environmentVariableNames = [
	"AUTHENTICATION_SECRET",
	"AWS_ACCOUNT_ID",
	"AWS_BINANCE_PROXY_REGION",
	"AWS_DATA_REGION",
	"AWS_SES_REGION",
	"BINANCE_PROXY_IP",
	"DEPLOY_STAGE",
	"DNS_DOMAIN",
	"NODE_ENV",
	"STRIPE_PLAN_BASIC_PRICE_ID",
	"PROJECT_SHORT_NAME",
	"STRIPE_SECRET_KEY",
	"STRIPE_WEBHOOK_SECRET"
] as const
export type EnvironmentVariableName = (typeof environmentVariableNames)[number]
