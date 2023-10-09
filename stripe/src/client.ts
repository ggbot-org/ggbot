import { ENV } from "@workspace/env"

import { Stripe } from "./Stripe.js"

export class StripeClient {
	private stripe: Stripe

	constructor() {
		this.stripe = new Stripe(ENV.STRIPE_SECRET_KEY(), {
			apiVersion: "2023-08-16"
		})
	}

	getWebhookEvent(
		/** Raw text body payload received from Stripe. */
		payload: string,
		/** Value of the `stripe-signature` header from Stripe. */
		signature: string
	): Stripe.Event {
		return this.stripe.webhooks.constructEvent(
			payload,
			signature,
			ENV.STRIPE_WEBHOOK_SECRET()
		)
	}
}
