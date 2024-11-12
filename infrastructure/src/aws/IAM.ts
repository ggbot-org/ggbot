export type IamAction =
	| "SES:SendEmail"
	| "SES:SendRawEmail"
	| "ec2:AssociateAddress"
	| "ec2:DescribeAddresses"
	| "ec2:DisassociateAddress"
	| "iam:PassRole"
	| "lambda:CreateFunction"
	| "lambda:InvokeFunction"
	| "lambda:UpdateFunctionCode"
	| "lambda:UpdateFunctionConfiguration"
	| "logs:CreateLogGroup"
	| "logs:CreateLogStream"
	| "logs:PutLogEvents"
	| "logs:PutRetentionPolicy"
	| "s3:DeleteObject"
	| "s3:GetObject"
	| "s3:ListBucket"
	| "s3:PutObject"

export type IamPolicyDocumentStatement<Action extends string> = {
	Action: Action[]
	Effect: "Allow"
	Resource: string | Array<string>
}

export type IamPolicyDocument<StatementName extends string, StatementAction extends string> = {
	policyDocument: {
		Version: "2012-10-17"
		Statement: Array<IamPolicyDocumentStatement<StatementAction>>
	}
	statementAction: Record<StatementName, IamPolicyDocumentStatement<StatementAction>["Action"]>
	statementResource: Record<StatementName, IamPolicyDocumentStatement<StatementAction>["Resource"]>
}

export class IamPolicy {
	accountId: string
	region: string
	name: string

	constructor(accountId: string, region: string, name: string) {
		this.accountId = accountId
		this.region = region
		this.name = name
	}

	get arn() {
		return `arn:aws:iam::${this.accountId}:policy/${this.name}`
	}

	static allowStatement<StatementAction extends string>(
		Action: IamPolicyDocumentStatement<StatementAction>["Action"],
		Resource: IamPolicyDocumentStatement<StatementAction>["Resource"]
	): IamPolicyDocumentStatement<StatementAction> {
		return {
			Effect: "Allow", Action, Resource
		}
	}
}
