export const environmentVariables = [
  "AWS_ACCOUNT_ID",
  "GGBOT2_DEPLOY_STAGE",
] as const;
export type EnvironmentVariable = typeof environmentVariables[number];
