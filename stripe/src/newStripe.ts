import { ENV } from '@workspace/env'

import { Stripe } from './Stripe.js'
import { checkStripeSecretKey } from './stripeSecretKey.js'

export function newStripe() {
	// Check Stripe secret key is consistent with deploy stage.
	const STRIPE_SECRET_KEY = ENV.STRIPE_SECRET_KEY()
	const DEPLOY_STAGE = ENV.DEPLOY_STAGE()
	checkStripeSecretKey(DEPLOY_STAGE, STRIPE_SECRET_KEY)

	// If all good, return Stripe client.
	return new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
}
