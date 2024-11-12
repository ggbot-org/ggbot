import { join } from "node:path"

import writeFile from "write-file-utf8"

import { DevopsPolicy } from "../aws/DevopsPolicy.js"
import { ElasticIpsPolicy } from "../aws/ElasticIpsPolicy.js"
import { IamPolicyDocument } from "../aws/IAM.js"
import { LambdaInvokePolicy } from "../aws/LambdaInvokePolicy.js"
import { LogsPolicy } from "../aws/LogsPolicy.js"
import { S3ReadWriteDataPolicy } from "../aws/S3ReadWriteDataPolicy.js"
import { SesNoreplyPolicy } from "../aws/SesNopeplyPolicy.js"
import { iamDir } from "../package.js"

function writePolicy ({
	name: policyName, policyDocument
}: { name: string } & Pick<IamPolicyDocument<string, string>, "policyDocument">) {
	const filePath = join(iamDir, `${policyName}.json`)
	console.info(`Generate IAM policy ${filePath}`)
	return writeFile(filePath, JSON.stringify(policyDocument, null, 2))
}

await writePolicy(new DevopsPolicy())
await writePolicy(new ElasticIpsPolicy())
await writePolicy(new LambdaInvokePolicy())
await writePolicy(new LogsPolicy())
await writePolicy(new S3ReadWriteDataPolicy())
await writePolicy(new SesNoreplyPolicy())
