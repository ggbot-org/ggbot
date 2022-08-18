import { getPolicy } from "@ggbot2/aws";
import { getDevopsPolicyArn } from "@ggbot2/infrastructure";
import { IamPolicyStatus } from "./_iam.js";
import { tagsIncludesProjectTag } from "./_tags.js";

const PolicyArn = getDevopsPolicyArn();

const getDevopsPolicy = async () => await getPolicy({ PolicyArn });

export type GetDevopsPolicyStatus = IamPolicyStatus;

export const getDevopsPolicyStatus = async (): Promise<IamPolicyStatus> => {
  const devopsPolicy = await getDevopsPolicy();
  const hasProjectTag = tagsIncludesProjectTag(devopsPolicy.Policy?.Tags ?? []);
  return { hasProjectTag };
};
