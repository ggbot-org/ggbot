const environmentVariableNames = [
  "AWS_REGION",
  "AWS_ACCOUNT_ID",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "DEPLOY_STAGE",
  "NODE_ENV",
  "UTRUST_API_KEY",
  "UTRUST_WEBHOOK_SECRET",
] as const;
export type EnvironmentVariableName = (typeof environmentVariableNames)[number];
