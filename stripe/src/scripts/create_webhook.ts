import { debug } from "../logging.js"
import { StripeWebhook } from "../StripeWebhook.js"

try {
	const webhook = new StripeWebhook()
	await webhook.create()
} catch (error) {
	debug(error)
}
