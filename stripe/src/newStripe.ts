import { ENV } from "@workspace/env"

import { Stripe } from "./Stripe.js"

export const newStripe = () =>
	new Stripe(ENV.STRIPE_SECRET_KEY(), {
		apiVersion: "2023-10-16"
	})
