import { userWebappDomain } from "@ggbot2/infrastructure";

// It does not make sense to use localhost even when
// `nodeEnvIsProduction` is false. Those URLs will not be reachable.
export const webappBaseUrl = `https://${userWebappDomain}`;
