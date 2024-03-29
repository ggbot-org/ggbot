import { isLiteralType } from "minimal-type-guard-helpers"

const iamPolicyIdentifiers = ["devops"] as const
type IamPolicyIdentifier = (typeof iamPolicyIdentifiers)[number]
export const isIamPolicyIdentifier =
	isLiteralType<IamPolicyIdentifier>(iamPolicyIdentifiers)
