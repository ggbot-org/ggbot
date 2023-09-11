import { Language } from "@workspace/models"

export type EmailMessageContent = {
	html: string
	text: string
	subject: string
}

export type GetEmailMessageContent<Arg> = (
	language: Language,
	arg: Arg
) => EmailMessageContent
