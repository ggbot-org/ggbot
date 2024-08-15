import { StripeWebhook } from "../StripeWebhook.js"

try {
	const webhook = new StripeWebhook()
	await webhook.create()
} catch (error) {
	console.debug(error)
}
