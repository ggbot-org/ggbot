import { CreateLogGroupCommand } from "@aws-sdk/client-cloudwatch-logs"
import { AwsAccountId, AwsRegion, AwsResource } from "@workspace/aws-types"

import { cloudwatchLogsClient } from "./client.js"

export class LogGroup implements AwsResource{
	readonly accountId: AwsAccountId
	readonly region: string
	readonly name: string

	constructor(accountId: AwsAccountId, region: AwsRegion, name: string) {
		this.accountId = accountId
		this.region = region
		this.name = name
	}

	get arn() {
		return `arn:aws:logs:${this.region}:${this.accountId}:log-group:${this.name}:*`
	}

	async create(logGroupClass: "STANDARD" | "INFREQUENT_ACCESS") {
		const command = new CreateLogGroupCommand({ logGroupName: this.name, logGroupClass })
		const client = cloudwatchLogsClient(this.region)
		await client.send(command)
	}
}
