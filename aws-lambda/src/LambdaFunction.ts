import { Architecture, CreateFunctionCommand, CreateFunctionCommandInput, PackageType, Runtime } from "@aws-sdk/client-lambda"
import { AwsAccountId, AwsRegion, AwsResource } from "@workspace/aws-types"

import { lambdaClient } from "./client.js"

export class LambdaFunction implements AwsResource {
	readonly accountId: AwsAccountId
	readonly region: string
	readonly name: string

	constructor(accountId: AwsAccountId, region: AwsRegion, name: string) {
		this.accountId = accountId
		this.region = region
		this.name = name
	}

	get arn () {
		return LambdaFunction.arn(this.accountId, this.region, this.name)
	}

	static arn (accountId: AwsAccountId, region: AwsRegion, name: string) {
		return `arn:aws:lambda:${region}:${accountId}:function:${name}`
	}

	async create({ Code, FunctionName, Role }: Pick<CreateFunctionCommandInput, "Code" | "FunctionName" | "Role">) {
		const command = new CreateFunctionCommand({
			Code,
			FunctionName,
			Role,
			Architectures: [Architecture.arm64],
			Handler: "index.handler",
			PackageType: PackageType.Zip,
			Runtime: Runtime.nodejs16x,
		})
		const client = lambdaClient(this.region)
		await client.send(command)
	}
}
