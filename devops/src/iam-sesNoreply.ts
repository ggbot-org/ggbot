import { getSesNoreplyPolicyArn } from "@ggbot2/infrastructure"

import { getIamPolicyStatus } from "./_iam.js"

const PolicyArn = getSesNoreplyPolicyArn()

export const getSesNoreplyPolicyStatus = async () =>
	await getIamPolicyStatus({ PolicyArn })
