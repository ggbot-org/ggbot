import { ENV } from '@workspace/env'

import { IamAction, IamPolicy, IamPolicyDocument, IamPolicyDocumentStatement } from './IAM.js'

const statementNames = [
	'describeAddresses',
	'handleAddressesAssociation',
] as const
type StatementName = (typeof statementNames)[number]
type StatementAction = Extract<IamAction,
	| 'ec2:DescribeAddresses'
	| 'ec2:AssociateAddress'
	| 'ec2:DisassociateAddress'
>

export class ElasticIpsPolicy extends IamPolicy {
	constructor() {
		super(ENV.AWS_ACCOUNT_ID(), ENV.AWS_DATA_REGION(), `${ENV.PROJECT_SHORT_NAME()}-elastic-ips-policy`)
	}

	get statementAction(): Record<StatementName, IamPolicyDocumentStatement<StatementAction>['Action']> {
		return {
			describeAddresses: [
				'ec2:DescribeAddresses',
			],
			handleAddressesAssociation: [
				'ec2:AssociateAddress',
				'ec2:DisassociateAddress',
			]
		}
	}

	get statementResource(): Record<StatementName, IamPolicyDocumentStatement<StatementAction>['Resource']> {
		const { accountId } = this
		return {
			describeAddresses: '*',
			handleAddressesAssociation: [
				`arn:aws:ec2:*:${accountId}:network-interface/*`,
				`arn:aws:ec2:*:${accountId}:elastic-ip/*`,
				`arn:aws:ec2:*:${accountId}:instance/*`,
			]
		}
	}

	get policyDocument(): IamPolicyDocument<StatementName, StatementAction>['policyDocument'] {
		return {
			Version: '2012-10-17',
			Statement: statementNames.map(
				(statementName) => IamPolicy.allowStatement(this.statementAction[statementName], this.statementResource[statementName])
			)
		}
	}
}
