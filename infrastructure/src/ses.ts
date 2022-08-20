import { getAwsAccountId } from "@ggbot2/env";
import { awsRegion } from "./awsRegion.js";
import { domainName } from "./domainNames.js";

export const noReplyAddress = `noreply@${domainName}`;

export const getSesIdentityArn = () => {
  const awsAccountId = getAwsAccountId();
  return `arn:aws:ses:${awsRegion}:${awsAccountId}:identity/${domainName}`;
};
