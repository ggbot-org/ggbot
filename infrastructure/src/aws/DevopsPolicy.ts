import { ENV } from '@workspace/env'

import { ApiRole } from './ApiRole.js'
import { IamAction, IamPolicy, IamPolicyDocument, IamPolicyDocumentStatement } from './IAM.js'
import { LambdaFunction } from './LambdaFunction.js'
import { DataBucket, WebappBucket, wholeBucket } from './s3Buckets.js'

const statementNames = [
	'deployWebapp',
	'downloadDataBuckets',
	'manageApiLambdas',
	'manageLambdasPassRole',
	'manageLogGroups',
] as const
type StatementName = (typeof statementNames)[number]
type StatementAction = Extract<IamAction,
	| 'iam:PassRole'
	| 'lambda:CreateFunction'
	| 'lambda:UpdateFunctionCode'
	| 'lambda:UpdateFunctionConfiguration'
	| 'logs:CreateLogGroup'
	| 'logs:PutRetentionPolicy'
	| 's3:DeleteObject'
	| 's3:GetObject'
	| 's3:ListBucket'
	| 's3:PutObject'
>

export class DevopsPolicy extends IamPolicy implements IamPolicyDocument<StatementName, StatementAction> {
	apiRole: ApiRole

	constructor() {
		super(ENV.AWS_ACCOUNT_ID(), ENV.AWS_DATA_REGION(), `${ENV.PROJECT_SHORT_NAME()}-devops-policy`)

		this.apiRole = new ApiRole()
	}

	get statementAction(): Record<StatementName, IamPolicyDocumentStatement<StatementAction>['Action']> {
		return {
			deployWebapp: [
				's3:DeleteObject',
				's3:ListBucket',
				's3:PutObject',
			],
			downloadDataBuckets: [
				's3:ListBucket',
				's3:GetObject',
			],
			manageApiLambdas: [
				'lambda:CreateFunction',
				'lambda:UpdateFunctionCode',
				'lambda:UpdateFunctionConfiguration',
			],
			// iam:PassRole is needed by lambda:CreateFunction
			manageLambdasPassRole: [
				'iam:PassRole',
			],
			manageLogGroups: [
				'logs:CreateLogGroup',
				'logs:PutRetentionPolicy',
			],
		}
	}

	get statementResource(): Record<StatementName, IamPolicyDocumentStatement<StatementAction>['Resource']> {
		return {
			deployWebapp: [
				...wholeBucket(new WebappBucket('main')),
				...wholeBucket(new WebappBucket('next')),
			],
			downloadDataBuckets: [
				...wholeBucket(new DataBucket('main')),
				...wholeBucket(new DataBucket('next')),
			],
			manageApiLambdas: new LambdaFunction(ENV.AWS_ACCOUNT_ID(), ENV.AWS_DATA_REGION(), '*').arn,
			manageLogGroups: '*',
			manageLambdasPassRole: this.apiRole.arn,
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
