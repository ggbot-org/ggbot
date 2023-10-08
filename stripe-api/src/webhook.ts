import {
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK
} from "@workspace/api-gateway"
import { ENV } from "@workspace/env"
import { logging } from "@workspace/logging"
import Stripe from "stripe"

const { info, warn } = logging("stripe-api")

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY(), { apiVersion: "2023-08-16" })

type ResponseData = {
	received: boolean
}

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		switch (event.httpMethod) {
			case "POST": {
				if (!event.body) return BAD_REQUEST()

				const signature = event.headers["stripe-signature"]
				if (typeof signature !== "string") return BAD_REQUEST()

				const stripeEvent = stripe.webhooks.constructEvent(
					event.body,
					signature,
					ENV.STRIPE_WEBHOOK_SECRET()
				)

				info(stripeEvent)

				switch (stripeEvent.type) {
					default: {
						warn(`Unhandled event type ${stripeEvent.type}`)
					}
				}

				const output: ResponseData = { received: true }
				return OK(output)
			}

			default:
				return METHOD_NOT_ALLOWED
		}
	} catch (error) {
		if (error instanceof Stripe.errors.StripeSignatureVerificationError)
			return BAD_REQUEST()
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
