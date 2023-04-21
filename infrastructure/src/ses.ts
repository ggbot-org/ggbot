import { getAwsAccountId } from "@ggbot2/env";
import { topLevelDomain } from "@ggbot2/locators";
import { awsRegion } from "./awsRegion.js";

export const getSesIdentityArn = () => {
  const awsAccountId = getAwsAccountId();
  return `arn:aws:ses:${awsRegion}:${awsAccountId}:identity/${topLevelDomain}`;
};
