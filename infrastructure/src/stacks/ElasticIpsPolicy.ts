import { IamPolicy, PolicyDocumentStatement } from "@workspace/aws-iam"
import { ENV } from "@workspace/env"

import { staticWebsiteAwsRegion } from "../awsRegions.js"

const statementNames = [
	"describeAddresses",
	"handleAddressesAssociation"
] as const
type ElasticIpsPolicyStatementName = (typeof statementNames)[number]

export class ElasticIpsPolicy extends IamPolicy {
	constructor() {
		super(
			ENV.AWS_ACCOUNT_ID(),
			staticWebsiteAwsRegion,
			`${ENV.PROJECT_SHORT_NAME()}-elastic-ips-policy`
		)
	}

	get statementAction(): Record<
		ElasticIpsPolicyStatementName,
		PolicyDocumentStatement["Action"]
	> {
		return {
			describeAddresses: ["ec2:DescribeAddresses"],
			handleAddressesAssociation: [
				"ec2:AssociateAddress",
				"ec2:DisassociateAddress"
			]
		}
	}

	get statementResource(): Record<
		ElasticIpsPolicyStatementName,
		PolicyDocumentStatement["Resource"]
	> {
		const { accountId } = this
		return {
			describeAddresses: "*",
			handleAddressesAssociation: [
				`arn:aws:ec2:*:${accountId}:network-interface/*`,
				`arn:aws:ec2:*:${accountId}:elastic-ip/*`,
				`arn:aws:ec2:*:${accountId}:instance/*`
			]
		}
	}

	get statement(): Record<
		ElasticIpsPolicyStatementName,
		PolicyDocumentStatement
	> {
		const allow = (
			statementName: ElasticIpsPolicyStatementName
		): PolicyDocumentStatement => ({
			Effect: "Allow",
			Action: this.statementAction[statementName],
			Resource: this.statementAction[statementName]
		})

		return {
			describeAddresses: allow("describeAddresses"),
			handleAddressesAssociation: allow("handleAddressesAssociation")
		}
	}
}
