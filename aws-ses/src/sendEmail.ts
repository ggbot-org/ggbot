import { SendEmailCommand } from "@aws-sdk/client-ses"
import { AwsRegion } from "@workspace/aws-types"

import { sesClient } from "./client.js"

type SendEmailInput = {
	html: string
	source: string
	subject: string
	text: string
	toAddresses: string[]
}

export const sendEmail = async (
	region: AwsRegion,
	{ html, source, subject, toAddresses, text }: SendEmailInput
) => {
	const Charset = "UTF-8"
	const command = new SendEmailCommand({
		Destination: {
			ToAddresses: toAddresses
		},
		Message: {
			Body: {
				Html: { Charset, Data: html },
				Text: { Charset, Data: text }
			},
			Subject: { Charset, Data: subject }
		},
		Source: source
	})
	const client = sesClient(region)
	return await client.send(command)
}
