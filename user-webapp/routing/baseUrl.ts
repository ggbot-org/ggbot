import { nodeEnvIsProduction } from "@ggbot2/env";
import { userWebappDomain } from "@ggbot2/infrastructure";

export const webappBaseUrl = nodeEnvIsProduction
  ? `https://${userWebappDomain}`
  : "http://localhost:3000";
