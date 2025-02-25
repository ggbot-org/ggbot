import { StripeMetadata } from '@workspace/api'
import { ENV } from '@workspace/env'
import { FQDN, WebappBaseURL, WebappURLs } from '@workspace/locators'
import { isYearlyPurchase } from '@workspace/models'

import { newStripe } from './newStripe.js'

export class StripeClient {
	stripe = newStripe()
	webapp = new WebappURLs(
		new WebappBaseURL(new FQDN(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN()))
	)

	/** Call `stripe.checkout.sessions.create()` adding context. */
	createCheckoutSession({
		email,
		metadata,
		price,
		quantity,
	}: {
		email: string
		metadata: StripeMetadata
		price: string
		quantity: number
	}) {
		return this.stripe.checkout.sessions.create({
			customer_email: email,
			line_items: [{ price, quantity }],
			metadata,
			mode: 'payment',
			success_url: this.webapp.subscriptionPurchased.href,
			cancel_url: this.webapp.purchaseCanceled.href,
		})
	}

	/** Call `stripe.checkout.sessions.retrieve()` and return relevant data. */
	async retreiveCheckoutSession(id: string) {
		const session = await this.stripe.checkout.sessions.retrieve(id, {
			expand: ['line_items'],
		})
		const quantity = session.line_items?.data[0].quantity
		if (typeof quantity !== 'number') {
			console.warn('No quantity found in line_items')
			return
		}
		return {
			quantity,
			isYearly: isYearlyPurchase({ numMonths: quantity }),
		}
	}
}
