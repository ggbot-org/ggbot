import { APIGatewayClient, GetDomainNameCommand, GetDomainNamesCommandOutput } from "@aws-sdk/client-api-gateway"
import { AwsAccountId, AwsRegion, AwsResource } from "@workspace/aws-types"

import { apiGatewayClient } from "./client.js"
import { ErrorCannotGetApiGatewayDomain } from "./errors.js"

export class ApiGatewayDomain implements AwsResource {
	readonly accountId: AwsAccountId
	readonly region: AwsRegion
	readonly domainName: string

	readonly client: APIGatewayClient

	constructor(
		accountId: AwsAccountId,
		region: AwsRegion,
		domainName: string
	) {
		this.accountId = accountId
		this.region = region
		this.domainName = domainName
		this.client = apiGatewayClient(region)
	}

	get arn() {
		return ApiGatewayDomain.arn(
			this.accountId,
			this.region,
			this.domainName
		)
	}

	get everyArn() {
		return ApiGatewayDomain.arn(this.accountId, this.region, "*")
	}

	static arn(accountId: AwsAccountId, region: AwsRegion, domainName: string) {
		const arnPrefix = `arn:aws:apigateway:${region}:${accountId}:domainnames/app`
		return `${arnPrefix}/${domainName}`
	}

	static everyArn(accountId: AwsAccountId, region: AwsRegion) {
		return ApiGatewayDomain.arn(accountId, region, "*")
	}

	async describe(): Promise<GetDomainNamesCommandOutput> {
		const command = new GetDomainNameCommand({
			domainName: this.domainName
		})
		const result = await this.client.send(command)
		if (!result) throw new ErrorCannotGetApiGatewayDomain()
		return result
	}
}
