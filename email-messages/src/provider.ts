import { SendEmailAction, SendEmailActionInput as Input } from "@workspace/api"
import { sendEmail } from "@workspace/aws-ses"
import { ENV } from "@workspace/env"
import { noReplyEmailAddress } from "@workspace/locators"
import { EmailAddress } from "@workspace/models"

import { EmailMessageContent } from "./emailMessage.js"
import { oneTimePasswordEmailMessage } from "./messageOneTimePassword.js"
import { suspendedStrategyEmailMessage } from "./messageSuspendedStrategy.js"

export class SendEmailProvider implements SendEmailAction {
	async SendOneTimePassword({
		email,
		oneTimePassword,
		language
	}: Input["SendOneTimePassword"]) {
		await this.sendEmail(
			email,
			oneTimePasswordEmailMessage(language, {
				oneTimePassword
			})
		)
	}

	async SuspendedStrategy({
		email,
		language,
		...strategyKey
	}: Input["SuspendedStrategy"]) {
		await this.sendEmail(
			email,
			suspendedStrategyEmailMessage(language, strategyKey)
		)
	}

	sendEmail(email: EmailAddress, emailMessage: EmailMessageContent) {
		return sendEmail(ENV.AWS_SES_REGION(), {
			source: noReplyEmailAddress(ENV.DNS_DOMAIN()),
			toAddresses: [email],
			...emailMessage
		})
	}
}
