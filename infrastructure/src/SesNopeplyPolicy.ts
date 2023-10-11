import { IamPolicy } from "@workspace/aws-iam"
import { ENV } from "@workspace/env"

import { SesIdentity } from "./SesIdentity.js"

export class SesNoreplyPolicy extends IamPolicy {
	sesIdentity: SesIdentity

	constructor() {
		super(
			ENV.AWS_ACCOUNT_ID(),
			ENV.AWS_SES_REGION(),
			`${ENV.PROJECT_SHORT_NAME()}-main-ses-noreply-policy`
		)

		this.sesIdentity = new SesIdentity()
	}

	get statement() {
		return {
			Effect: "Allow",
			Resource: this.sesIdentity.arn,
			Action: ["SES:SendEmail", "SES:SendRawEmail"]
			// TODO try
			// "Condition": {
			//    "StringLike": {
			//        "ses:FromAddress": "noreply@ggbot2.com"
			//        where addres comes from @wrokspace locators noReplyEmailAddress
			//    }
			// }
		}
	}
}
