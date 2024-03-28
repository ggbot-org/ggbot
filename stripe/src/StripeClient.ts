import { StripeMetadata } from "@workspace/api"
import { ENV } from "@workspace/env"
import { WebappURLs } from "@workspace/locators"
import { isYearlyPurchase } from "@workspace/models"

import { newStripe } from "./newStripe.js"

export class StripeClient {
	private stripe = newStripe()
	private webapp = new WebappURLs(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN())

	/** Call `stripe.checkout.sessions.create()` adding context. */
	createCheckoutSession({
		email,
		metadata,
		price,
		quantity
	}: {
		email: string
		metadata: StripeMetadata
		price: string
		quantity: number
	}) {
		return this.stripe.checkout.sessions.create({
			customer_email: email,
			line_items: [
				{
					price,
					quantity
				}
			],
			metadata,
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

	/** Call `stripe.checkout.sessions.retrieve()` and return relevant data. */
	async retreiveCheckoutSession(id: string) {
		const session = await this.stripe.checkout.sessions.retrieve(id, {
			expand: ["line_items"]
		})
		const quantity = session.line_items?.data[0].quantity
		if (typeof quantity !== "number") return
		return {
			quantity,
			isYearly: isYearlyPurchase({ numMonths: quantity })
		}
	}
}
