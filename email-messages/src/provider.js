import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { ENV } from '@workspace/env'
import { noReplyEmailAddress } from '@workspace/locators'

import { oneTimePasswordEmailMessage } from './messageOneTimePassword.js'
import { suspendedStrategyEmailMessage } from './messageSuspendedStrategy.js'

/**
 * @typedef {import('@workspace/api').SendEmailAction} SendEmailAction
 * @typedef {import('@workspace/api').SendEmailActionInput} Input
 */

/** @implements {SendEmailAction} */
export class SendEmailProvider {
	sesClient = new SESClient({ apiVersion: '2010-12-01', region: ENV.AWS_SES_REGION() })

	/** @param {Input['SendOneTimePassword']} arg */
	async SendOneTimePassword({ email, oneTimePassword, language }) {
		await this.sendEmail(
			email,
			oneTimePasswordEmailMessage(language, { oneTimePassword })
		)
	}

	/** @param {Input['SuspendedStrategy']} arg */
	async SuspendedStrategy({ email, language, ...strategyKey }) {
		await this.sendEmail(
			email,
			suspendedStrategyEmailMessage(language, strategyKey)
		)
	}

	/**
	 * @param {import('@workspace/models').EmailAddress} email
	 * @param {import ('./types').EmailMessageContent} emailMessage
	 */
	async sendEmail(email, emailMessage) {
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
