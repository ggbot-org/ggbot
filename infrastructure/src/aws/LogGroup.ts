import { CloudWatchLogsClient, CreateLogGroupCommand } from '@aws-sdk/client-cloudwatch-logs'
import { ENV } from '@workspace/env'

export class LogGroup {
	client: CloudWatchLogsClient

	/**
	 * @example
	 *
	 * ```
	 * /aws/lambda/<Lambda function name>
	 * ```
	 */
	logGroupName: string

	region: string

	constructor(region: string, logGroupName: string) {
		this.client = new CloudWatchLogsClient({ region })
		this.region = region
		this.logGroupName = logGroupName
	}

	get arn() {
		return `arn:aws:logs:${this.region}:${ENV.AWS_ACCOUNT_ID()}:log-group:${this.logGroupName}:*`
	}

	async create() {
		await this.client.send(new CreateLogGroupCommand({
			logGroupName: this.logGroupName
		}))
	}
}
