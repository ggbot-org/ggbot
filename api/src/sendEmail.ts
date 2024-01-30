import { EmailAddress, Language, OneTimePassword } from "@workspace/models"

import { Action } from "./action.js"

export type SendEmailAction = {
	SendOneTimePassword: Action<
		{
			email: EmailAddress
			oneTimePassword: OneTimePassword
			language: Language
		},
		void
	>
}

export type SendEmailActionInput = {
	SendOneTimePassword: Parameters<SendEmailAction["SendOneTimePassword"]>[0]
}
