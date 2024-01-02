import {
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK
} from "@workspace/api-gateway"
import {
	StripeClient,
	StripeSignatureVerificationError
} from "@workspace/stripe"

import { info, warn } from "./logging.js"

const stripe = new StripeClient()

type ResponseData = {
	received: boolean
}

// @ts-expect-error TODO use async/await ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = (event) => {
	try {
		if (event.httpMethod === "POST") {
			if (!event.body) return BAD_REQUEST()

			const signature = event.headers["stripe-signature"]
			if (typeof signature !== "string") return BAD_REQUEST()

			const stripeEvent = stripe.getWebhookEvent(event.body, signature)

			info(stripeEvent)

			switch (stripeEvent.type) {
				default: {
					warn(`Unhandled event type ${stripeEvent.type}`)
				}
			}

			const output: ResponseData = { received: true }
			return OK(output)
		}

		return METHOD_NOT_ALLOWED
	} catch (error) {
		if (error instanceof StripeSignatureVerificationError)
			return BAD_REQUEST()
		// Fallback to print error if not handled.
		warn(error)
	}
	return INTERNAL_SERVER_ERROR
}
