import { sendEmail } from "@workspace/aws-ses"
import { oneTimePasswordEmailMessage } from "@workspace/email-messages"
import { ENV } from "@workspace/env"
import { noReplyEmailAddress } from "@workspace/locators"
import {
	createdNow,
	CreationTime,
	EmailAddress,
	Language,
	OneTimePassword
} from "@workspace/models"

type SendOneTimePassword = (arg: {
	email: EmailAddress
	oneTimePassword: OneTimePassword
	language: Language
}) => Promise<CreationTime>

export const sendOneTimePassword: SendOneTimePassword = async ({
	language,
	email,
	oneTimePassword
}) => {
	const whenCreated = createdNow()
	const emailMessage = oneTimePasswordEmailMessage(language, {
		oneTimePassword
	})
	await sendEmail(ENV.AWS_SES_REGION(), {
		source: noReplyEmailAddress(ENV.DNS_DOMAIN()),
		toAddresses: [email],
		...emailMessage
	})
	return whenCreated
}
