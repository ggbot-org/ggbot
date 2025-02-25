import {
	LambdaClient,
	UpdateFunctionConfigurationCommand,
} from '@aws-sdk/client-lambda'
import {
	Architecture,
	CreateFunctionCommand,
	FunctionCode,
	PackageType,
	Runtime,
	UpdateFunctionCodeCommand,
} from '@aws-sdk/client-lambda'
import { ENV } from '@workspace/env'

export class LambdaFunction {
	client: LambdaClient
	region: string
	functionName: string
	architecture = Architecture.arm64
	executionRoleArn = ''
	runtime = Runtime.nodejs20x
	handler = 'index.handler'

	constructor(region: string, functionName: string) {
		this.client = new LambdaClient({ region })
		this.region = region
		this.functionName = functionName
	}

	static arn(region: string, functionName: string) {
		return `arn:aws:lambda:${region}:${ENV.AWS_ACCOUNT_ID()}:function:${functionName}`
	}

	get arn() {
		return LambdaFunction.arn(this.region, this.functionName)
	}

	async create({
		Role,
		ZipFile,
	}: Required<
		Pick<FunctionCode, 'ZipFile'> & {
			/* Execution role ARN */
			Role: string
		}
	>) {
		await this.client.send(
			new CreateFunctionCommand({
				Architectures: [this.architecture],
				Code: { ZipFile },
				FunctionName: this.functionName,
				Handler: this.handler,
				PackageType: PackageType.Zip,
				Role,
				Runtime: this.runtime,
			})
		)
	}

	async setEnvironment(Variables: Record<string, string>) {
		await this.client.send(
			new UpdateFunctionConfigurationCommand({
				FunctionName: this.functionName,
				Environment: { Variables },
			})
		)
	}

	async update({ ZipFile }: Required<Pick<FunctionCode, 'ZipFile'>>) {
		await this.client.send(
			new UpdateFunctionCodeCommand({
				ZipFile,
				FunctionName: this.functionName,
				Architectures: [this.architecture],
			})
		)
	}
}
