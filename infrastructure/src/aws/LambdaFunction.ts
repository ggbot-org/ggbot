import { LambdaClient } from "@aws-sdk/client-lambda"
import { Architecture, CreateFunctionCommand, FunctionCode, PackageType, Runtime, UpdateFunctionCodeCommand } from "@aws-sdk/client-lambda"

export class LambdaFunction {
	client: LambdaClient
	accountId: string
	region: string
	functionName: string
	architecture = Architecture.arm64
	executionRoleArn = ""
	runtime = Runtime.nodejs20x
	handler = "index.handler"

	constructor(accountId: string, region: string, functionName: string) {
		this.client = new LambdaClient({ region })
		this.accountId = accountId
		this.region = region
		this.functionName = functionName
	}

	get arn() {
		return LambdaFunction.arn(this.accountId, this.region, this.functionName)
	}

	static arn(accountId: string, region: string, functionName: string) {
		return `arn:aws:lambda:${region}:${accountId}:function:${functionName}`
	}

	async create({ ZipFile }: Required<Pick<FunctionCode, "ZipFile">>) {
		await this.client.send(new CreateFunctionCommand({
			Code: { ZipFile },
			FunctionName: this.functionName,
			Role: this.executionRoleArn,
			Architectures: [this.architecture],
			Handler: this.handler,
			PackageType: PackageType.Zip,
			Runtime: this.runtime,
		}))
	}

	async updateFunctionCode({ ZipFile }: Required<Pick<FunctionCode, "ZipFile">>) {
		await this.client.send(new UpdateFunctionCodeCommand({
			ZipFile,
			FunctionName: this.functionName,
			Architectures: [this.architecture],
		}))
	}
}
