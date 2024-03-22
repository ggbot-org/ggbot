import { ENV } from "@workspace/env"

import { newStripe } from "./newStripe.js"

export class StripeClient {
	private stripe = newStripe()

	/**
	 * Call `stripe.webhooks.constructEvent()` adding `STRIPE_WEBHOOK_SECRET`
	 * from environment.
	 */
	getWebhookEvent(
		/** Raw text body payload received from Stripe. */
		payload: string,
		/** Value of the `stripe-signature` header from Stripe. */
		signature: string
	) {
		return this.stripe.webhooks.constructEvent(
			payload,
			signature,
			ENV.STRIPE_WEBHOOK_SECRET()
		)
	}
}
