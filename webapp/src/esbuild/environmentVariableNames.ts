const environmentVariableNames = [
	"DEPLOY_STAGE",
	"DNS_DOMAIN",
	"STRIPE_PLAN_BASIC_MONTHLY_PRICE"
] as const
export type EnvironmentVariableName = (typeof environmentVariableNames)[number]
