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
	"PROJECT_SHORT_NAME",
	"STRIPE_PLAN_BASIC_MONTHLY_PRICE",
	"STRIPE_PLAN_BASIC_PRICE_ID",
	"STRIPE_SECRET_KEY"
] as const
export type EnvironmentVariableName = (typeof environmentVariableNames)[number]
