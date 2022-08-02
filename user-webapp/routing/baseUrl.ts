import { userWebappDomain } from "@ggbot2/aws";
import { nodeEnvIsProduction } from "@ggbot2/env";

export const webappBaseUrl = nodeEnvIsProduction
  ? `https://${userWebappDomain}`
  : "http://localhost:3000";
