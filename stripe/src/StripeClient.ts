import { ENV } from "@workspace/env"
import { WebappURLs } from "@workspace/locators"
import { AccountKey } from "@workspace/models"

import { newStripe } from "./newStripe.js"

export class StripeClient {
	private stripe = newStripe()
	private webapp = new WebappURLs(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN())

	/** Call `stripe.checkout.sessions.create()` adding context. */
	createCheckoutSession({
		accountId,
		/** Number of months to subscribe. */
		quantity
	}: AccountKey & {
		quantity: number
	}) {
		return this.stripe.checkout.sessions.create({
			line_items: [
				{
					price: ENV.STRIPE_PLAN_BASIC_PRICE_ID(),
					quantity
				}
			],
			metadata: {
				accountId
			},
			mode: "payment",
			success_url: this.webapp.subscriptionPurchased.href,
			cancel_url: this.webapp.purchaseCanceled.href
		})
	}

	/** Call `stripe.webhooks.constructEvent()` adding context. */
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
