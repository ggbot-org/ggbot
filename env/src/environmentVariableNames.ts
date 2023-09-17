const environmentVariableNames = [
	"AWS_ACCOUNT_ID",
	"BINANCE_PROXY_BASE_URL",
	"BINANCE_PROXY_STATIC_IPS",
	"DEPLOY_STAGE",
	"DNS_DOMAIN",
	"JWT_SECRET",
	"NODE_ENV",
	"UTRUST_API_KEY",
	"UTRUST_WEBHOOK_SECRET"
] as const
export type EnvironmentVariableName = (typeof environmentVariableNames)[number]
