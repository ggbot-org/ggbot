const environmentVariableNames = [
	"AWS_ACCOUNT_ID",
	"AWS_BINANCE_PROXY_REGION",
	"AWS_DATA_REGION",
	"AWS_SES_REGION",
	"BINANCE_PROXY_BASE_URL",
	"BINANCE_PROXY_ELASTIC_IPS",
	"DEPLOY_STAGE",
	"DNS_DOMAIN",
	"JWT_SECRET",
	"NODE_ENV",
	"PROJECT_SHORT_NAME",
	"UTRUST_API_KEY",
	"UTRUST_WEBHOOK_SECRET"
] as const
export type EnvironmentVariableName = (typeof environmentVariableNames)[number]
