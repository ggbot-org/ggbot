import { DevopsPolicy } from "../bootstrap/DevopsPolicy.js"
import { isIamPolicyIdentifier } from "../iamPolicies.js"

const iamPolicyIdentifier = process.argv[2]

if (!isIamPolicyIdentifier(iamPolicyIdentifier)) process.exit(1)

if (iamPolicyIdentifier === "devops") {
	const policy = new DevopsPolicy()

	// TODO print the whole policy document

	// eslint-disable-next-line no-console
	console.log(policy.statementAction)

	// TODO create a deploy_iam_policy script
}
