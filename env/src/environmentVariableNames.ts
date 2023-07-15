const environmentVariableNames = [
  "AWS_REGION",
  "AWS_ACCOUNT_ID",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "DEPLOY_STAGE",
  "GGBOT2_AUTHENTICATION_PRIVATE_KEY",
  "GGBOT2_AUTHENTICATION_PUBLIC_KEY",
  "NODE_ENV",
  "UTRUST_API_KEY",
  "UTRUST_WEBHOOK_SECRET",
] as const;
export type EnvironmentVariableName = (typeof environmentVariableNames)[number];
