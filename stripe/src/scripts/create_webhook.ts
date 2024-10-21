import { StripeWebhook } from "../StripeWebhook.js"

const webhook = new StripeWebhook()
await webhook.create()
