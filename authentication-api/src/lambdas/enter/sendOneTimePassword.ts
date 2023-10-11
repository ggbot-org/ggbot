import { sendEmail } from "@workspace/aws-ses"
import { oneTimePasswordEmailMessage } from "@workspace/email-messages"
import { ENV } from "@workspace/env"
import { noReplyEmailAddress } from "@workspace/locators"
import { createdNow, SendOneTimePassword } from "@workspace/models"

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
