import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { SendEmailAction, SendEmailActionInput as Input } from '@workspace/api'
import { ENV } from '@workspace/env'
import { noReplyEmailAddress } from '@workspace/locators'
import { EmailAddress } from '@workspace/models'

import { oneTimePasswordEmailMessage } from './messageOneTimePassword.js'
import { suspendedStrategyEmailMessage } from './messageSuspendedStrategy.js'
import { EmailMessageContent } from './types.js'

export class SendEmailProvider implements SendEmailAction {
	sesClient = new SESClient({ apiVersion: '2010-12-01', region: ENV.AWS_SES_REGION() })

	async SendOneTimePassword({ email, oneTimePassword, language }: Input['SendOneTimePassword']) {
		await this.sendEmail(
			email,
			oneTimePasswordEmailMessage(language, { oneTimePassword })
		)
	}

	async SuspendedStrategy({ email, language, ...strategyKey }: Input['SuspendedStrategy']) {
		await this.sendEmail(
			email,
			suspendedStrategyEmailMessage(language, strategyKey)
		)
	}

	async sendEmail(email: EmailAddress, emailMessage: EmailMessageContent) {
		await this.sesClient.send(
			new SendEmailCommand({
				Destination: { ToAddresses: [email] },
				Message: {
					Body: {
						Html: { Charset: 'UTF-8', Data: emailMessage.html },
						Text: { Charset: 'UTF-8', Data: emailMessage.text }
					},
					Subject: { Charset: 'UTF-8', Data: emailMessage.subject }
				},
				Source: noReplyEmailAddress(ENV.DNS_DOMAIN())
			}))
	}
}
