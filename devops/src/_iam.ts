import { GetPolicyArgs, getPolicy } from "@ggbot2/aws";
import { TagsStatus, tagsIncludesProjectTag } from "./_tags.js";

export type IamPolicyStatus = TagsStatus;

export const getIamPolicyStatus = async ({
  PolicyArn,
}: GetPolicyArgs): Promise<IamPolicyStatus> => {
  const { Policy } = await getPolicy({ PolicyArn });
  const hasProjectTag = tagsIncludesProjectTag(Policy?.Tags ?? []);
  return { hasProjectTag };
};
