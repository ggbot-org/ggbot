const environmentVariableNames = ["DEPLOY_STAGE", "DNS_DOMAIN"] as const
export type EnvironmentVariableName = (typeof environmentVariableNames)[number]
