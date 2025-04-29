import { ENV } from '@workspace/env'

import {
	IamAction,
	IamPolicy,
	IamPolicyDocument,
	IamPolicyDocumentStatement,
} from './IAM.js'
import { SesIdentity } from './SesIdentity.js'

const statementNames = ['sendEmail'] as const
type StatementName = (typeof statementNames)[number]
type StatementAction = Extract<IamAction, 'SES:SendEmail' | 'SES:SendRawEmail'>
export class SesNoreplyPolicy
	extends IamPolicy
	implements IamPolicyDocument<StatementName, StatementAction>
{
	sesIdentity: SesIdentity = new SesIdentity()

	constructor() {
		super(
			ENV.AWS_ACCOUNT_ID(),
			ENV.AWS_SES_REGION(),
			`${ENV.PROJECT_SHORT_NAME()}-ses-noreply-policy`
		)
	}

	get statementAction(): Record<
		StatementName,
		IamPolicyDocumentStatement<StatementAction>['Action']
	> {
		return {
			sendEmail: ['SES:SendEmail', 'SES:SendRawEmail'],
		}
	}

	get statementResource(): Record<
		StatementName,
		IamPolicyDocumentStatement<StatementAction>['Resource']
	> {
		return {
			sendEmail: this.sesIdentity.arn,
		}
	}

	get policyDocument(): IamPolicyDocument<
		StatementName,
		StatementAction
	>['policyDocument'] {
		return {
			Version: '2012-10-17',
			Statement: statementNames.map((statementName) =>
				IamPolicy.allowStatement(
					this.statementAction[statementName],
					this.statementResource[statementName]
				)
			),
		}
	}
}
