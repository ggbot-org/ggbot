import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses"

import { AwsRegion } from "./region.js"

const sesClient = (region: AwsRegion) =>
	new SESClient({ apiVersion: "2010-12-01", region })

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
