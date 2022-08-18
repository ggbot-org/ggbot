export const environmentVariables = ["AWS_ACCOUNT_ID", "DEPLOY_STAGE"] as const;

export type EnvironmentVariable = typeof environmentVariables[number];
