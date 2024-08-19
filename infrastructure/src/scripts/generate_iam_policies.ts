import { join } from "node:path"

import { IamPolicy, IamPolicyDocument } from "@workspace/aws-iam"
import writeFile from "write-file-utf8"

import { DevopsPolicy } from "../aws/DevopsPolicy.js"
import { ElasticIpsPolicy } from "../aws/ElasticIpsPolicy.js"
import { SesNoreplyPolicy } from "../aws/SesNopeplyPolicy.js"
import { iamDir } from "../package.js"

function writePolicy ({
	policyName, policyDocument
}: Pick<IamPolicy, "policyName"> & Pick<IamPolicyDocument<string, string>, "policyDocument">) {
	return writeFile(
		join(iamDir, `${policyName}.json`),
		JSON.stringify(policyDocument, null, 2)
	)
}

await writePolicy(new DevopsPolicy())
await writePolicy(new ElasticIpsPolicy())
await writePolicy(new SesNoreplyPolicy())
