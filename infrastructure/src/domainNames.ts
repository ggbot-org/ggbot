import { deployStageIsMain } from "@ggbot2/env";

export const domainName = "ggbot2.com";
export const assetsDomain = `assets.${domainName}`;
export const designDomain = `design.${domainName}`;
export const wwwDomain = `www.${domainName}`;

export const userWebappDomain = `${
  deployStageIsMain ? "app" : "next"
}.${domainName}`;
