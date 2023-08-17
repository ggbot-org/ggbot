import {
	Destination,
	Message,
	SendEmailCommand,
	SESClient
} from "@aws-sdk/client-ses"
import { awsSesRegion } from "@ggbot2/infrastructure"

const ses = new SESClient({ apiVersion: "2010-12-01", region: awsSesRegion })

export type SendEmailInput = {
	html: string
	source: string
	subject: string
	text: string
	toAddresses: string[]
}

export const sendEmail = async ({
	html,
	source,
	subject,
	toAddresses,
	text
}: SendEmailInput) => {
	const Charset = "UTF-8"

	const destination: Destination = {
		ToAddresses: toAddresses
	}

	const message: Message = {
		Body: {
			Html: { Charset, Data: html },
			Text: { Charset, Data: text }
		},
		Subject: { Charset, Data: subject }
	}

	const command = new SendEmailCommand({
		Destination: destination,
		Message: message,
		Source: source
	})

	await ses.send(command)
}
