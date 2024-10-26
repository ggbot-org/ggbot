import { Architecture, CreateFunctionCommand, FunctionCode, PackageType, Runtime, UpdateFunctionCodeCommand } from "@aws-sdk/client-lambda"
import { AwsAccountId, AwsRegion, AwsResource } from "@workspace/aws-types"

import { lambdaClient } from "./client.js"

export class LambdaFunction implements AwsResource {
	readonly accountId: AwsAccountId
	readonly region: string
	readonly functionName: string
	readonly architecture = Architecture.arm64
	readonly executionRoleArn: string
	readonly runtime = Runtime.nodejs20x
	readonly handler = "index.handler"

	constructor(accountId: AwsAccountId, region: AwsRegion, functionName: string, executionRoleArn: string) {
		this.accountId = accountId
		this.region = region
		this.functionName = functionName
		this.executionRoleArn = executionRoleArn
	}

	get arn() {
		return LambdaFunction.arn(this.accountId, this.region, this.functionName)
	}

	static arn(accountId: AwsAccountId, region: AwsRegion, functionName: string) {
		return `arn:aws:lambda:${region}:${accountId}:function:${functionName}`
	}

	async create({ ZipFile }: Required<Pick<FunctionCode, "ZipFile">>) {
		const command = new CreateFunctionCommand({
			Code: { ZipFile },
			FunctionName: this.functionName,
			Role: this.executionRoleArn,
			Architectures: [this.architecture],
			Handler: this.handler,
			PackageType: PackageType.Zip,
			Runtime: this.runtime,
		})
		const client = lambdaClient(this.region)
		await client.send(command)
	}

	async updateFunctionCode({ ZipFile }: Required<Pick<FunctionCode, "ZipFile">>) {
		const command = new UpdateFunctionCodeCommand({
			ZipFile,
			FunctionName: this.functionName,
			Architectures: [this.architecture],
		})
		const client = lambdaClient(this.region)
		await client.send(command)
	}
}
