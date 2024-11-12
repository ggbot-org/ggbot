import { ENV } from '@workspace/env'

import { IamAction, IamPolicy, IamPolicyDocument, IamPolicyDocumentStatement } from './IAM.js'

const statementNames = [
	'handleLogs',
] as const
type StatementName = (typeof statementNames)[number]
type StatementAction = Extract<IamAction,
	| 'logs:CreateLogGroup'
	| 'logs:CreateLogStream'
	| 'logs:PutLogEvents'
>

export class LogsPolicy extends IamPolicy {
	constructor() {
		super(ENV.AWS_ACCOUNT_ID(), ENV.AWS_DATA_REGION(), `${ENV.PROJECT_SHORT_NAME()}-logs-policy`)
	}

	get statementAction(): Record<StatementName, IamPolicyDocumentStatement<StatementAction>['Action']> {
		return {
			handleLogs: [
				'logs:CreateLogGroup',
				'logs:CreateLogStream',
				'logs:PutLogEvents',
			],
		}
	}

	get statementResource(): Record<StatementName, IamPolicyDocumentStatement<StatementAction>['Resource']> {
		const { accountId, region } = this
		return {
			handleLogs: `arn:aws:logs:${region}:${accountId}:*`
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

