import { getPolicy, GetPolicyArgs } from "@workspace/aws"

import { tagsIncludesProjectTag, TagsStatus } from "./_tags.js"

export type IamPolicyStatus = TagsStatus

export const getIamPolicyStatus = async ({
	PolicyArn
}: GetPolicyArgs): Promise<IamPolicyStatus> => {
	const { Policy } = await getPolicy({ PolicyArn })
	const hasProjectTag = tagsIncludesProjectTag(Policy?.Tags ?? [])
	return { hasProjectTag }
}
