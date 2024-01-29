import { EmailAddress, Language, OneTimePassword } from "@workspace/models"

export type SendEmailAction = {
	SendOneTimePassword: (arg: {
		email: EmailAddress
		oneTimePassword: OneTimePassword
		language: Language
	}) => Promise<void>
}

export type SendEmailActionInput = {
	SendOneTimePassword: Parameters<SendEmailAction["SendOneTimePassword"]>[0]
}
