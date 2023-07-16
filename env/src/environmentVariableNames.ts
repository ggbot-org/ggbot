const environmentVariableNames = [
  "AWS_REGION",
  "AWS_ACCOUNT_ID",
  "DEPLOY_STAGE",
  "JWT_SECRET",
  "NODE_ENV",
  "UTRUST_API_KEY",
  "UTRUST_WEBHOOK_SECRET",
] as const;
export type EnvironmentVariableName = (typeof environmentVariableNames)[number];
