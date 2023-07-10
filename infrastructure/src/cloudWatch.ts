import { ENV } from "@ggbot2/env";

import { awsRegion } from "./awsRegions.js";

const { AWS_ACCOUNT_ID } = ENV;

export const getLogsArn = () => `arn:aws:logs:${awsRegion}:${AWS_ACCOUNT_ID}:*`;
