import { LambdaClient, UpdateFunctionConfigurationCommand } from '@aws-sdk/client-lambda'
import { Architecture, CreateFunctionCommand, FunctionCode, PackageType, Runtime, UpdateFunctionCodeCommand } from '@aws-sdk/client-lambda'

export class LambdaFunction {
	client: LambdaClient
	accountId: string
	region: string
	functionName: string
	architecture = Architecture.arm64
	executionRoleArn = ''
	runtime = Runtime.nodejs20x
	handler = 'index.handler'

	constructor(accountId: string, region: string, functionName: string) {
		this.client = new LambdaClient({ region })
		this.accountId = accountId
		this.region = region
		this.functionName = functionName
	}

	static arn(accountId: string, region: string, functionName: string) {
		return `arn:aws:lambda:${region}:${accountId}:function:${functionName}`
	}

	get arn() {
		return LambdaFunction.arn(this.accountId, this.region, this.functionName)
	}

	async create({ Role, ZipFile }: Required<Pick<FunctionCode, 'ZipFile'> & {
		/* Execution role ARN */
		Role: string
	}>) {
		await this.client.send(new CreateFunctionCommand({
			Architectures: [this.architecture],
			Code: { ZipFile },
			FunctionName: this.functionName,
			Handler: this.handler,
			PackageType: PackageType.Zip,
			Role,
			Runtime: this.runtime,
		}))
	}

	async setEnvironment(Variables: Record<string, string>) {
		await this.client.send(new UpdateFunctionConfigurationCommand({
			FunctionName: this.functionName,
			Environment: { Variables }
		}))
	}

	async update({ ZipFile }: Required<Pick<FunctionCode, 'ZipFile'>>) {
		await this.client.send(new UpdateFunctionCodeCommand({
			ZipFile,
			FunctionName: this.functionName,
			Architectures: [this.architecture],
		}))
	}
}
