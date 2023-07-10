import { ENV } from "@ggbot2/env";
import { topLevelDomain } from "@ggbot2/locators";

import { awsRegion } from "./awsRegions.js";

const { AWS_ACCOUNT_ID } = ENV;

export const getSesIdentityArn = () =>
  `arn:aws:ses:${awsRegion}:${AWS_ACCOUNT_ID}:identity/${topLevelDomain}`;
