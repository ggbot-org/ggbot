import {
	ApiService,
	AuthClientActionOutput as Output,
	AuthClientActionType,
	DocumentProviderLevel2,
	isAuthClientActionInput as isInput
} from "@workspace/api"
import { sendEmail } from "@workspace/aws-ses"
import { AuthDatabase } from "@workspace/database"
import { oneTimePasswordEmailMessage } from "@workspace/email-messages"
import { ENV } from "@workspace/env"
import { BadRequestError } from "@workspace/http"
import { noReplyEmailAddress } from "@workspace/locators"
import {
	createdNow,
	EmailAddress,
	Language,
	OneTimePassword
} from "@workspace/models"

// TODO
export class Service implements ApiService<AuthClientActionType> {
	dataProvider: AuthDatabase

	constructor(documentProvider: DocumentProviderLevel2) {
		this.dataProvider = new AuthDatabase(documentProvider)
	}

	async Enter(arg: unknown) {
		if (!isInput.Enter(arg)) throw new BadRequestError()
		const { email } = arg
		const oneTimePassword =
			await this.dataProvider.CreateOneTimePassword(email)
		await this.sendOneTimePassword({
			language: "en",
			email,
			oneTimePassword
		})
		return {
			emailSent: true
		} satisfies Output["Enter"]
	}

	async sendOneTimePassword({
		language,
		email,
		oneTimePassword
	}: {
		email: EmailAddress
		oneTimePassword: OneTimePassword
		language: Language
	}) {
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
}
