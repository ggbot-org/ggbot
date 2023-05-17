import { getDevopsPolicyArn } from "@ggbot2/infrastructure";

import { getIamPolicyStatus } from "./_iam.js";

const PolicyArn = getDevopsPolicyArn();

export const getDevopsPolicyStatus = async () =>
  await getIamPolicyStatus({ PolicyArn });
