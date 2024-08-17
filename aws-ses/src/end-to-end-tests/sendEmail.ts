import { sendEmail } from "../index.js"

const EMAIL = process.env.EMAIL
if (!EMAIL) throw new Error("Set EMAIL environment variable")

const DNS_DOMAIN = process.env.DNS_DOMAIN
if (!DNS_DOMAIN) throw new Error("Set DNS_DOMAIN environment variable")

const AWS_SES_REGION = process.env.AWS_SES_REGION
if (!AWS_SES_REGION) throw new Error("Set AWS_SES_REGION environment variable")

await sendEmail(AWS_SES_REGION, {
	toAddresses: [EMAIL],
	source: `noreply@${DNS_DOMAIN}`,
	subject: "test", html: "test", text: "test"
})
