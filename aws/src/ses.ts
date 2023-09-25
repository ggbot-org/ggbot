import {
	SendEmailCommand,
	SESClient,
	SESClientConfig
} from "@aws-sdk/client-ses"

import { AwsClientConfigRegion } from "./region.js"

type SESClientArgs = AwsClientConfigRegion & Omit<SESClientConfig, "apiVersion">

const sesClient = (args: SESClientArgs) =>
	new SESClient({ apiVersion: "2010-12-01", ...args })

type SendEmailInput = {
	html: string
	source: string
	subject: string
	text: string
	toAddresses: string[]
}

export const sendEmail = async (
	clientArgs: SESClientArgs,
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
	const client = sesClient(clientArgs)
	return await client.send(command)
}
