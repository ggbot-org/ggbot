import { ENV } from "@ggbot2/env";
import { topLevelDomain } from "@ggbot2/locators";

import { awsRegion } from "./awsRegions.js";

export const getSesIdentityArn = () =>
  `arn:aws:ses:${awsRegion}:${ENV.AWS_ACCOUNT_ID()}:identity/${topLevelDomain}`;
