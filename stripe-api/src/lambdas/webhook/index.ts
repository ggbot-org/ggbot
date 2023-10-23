import {
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK
} from "@workspace/api-gateway"
import { logging } from "@workspace/logging"
import {
	StripeClient,
	StripeSignatureVerificationError
} from "@workspace/stripe"

const { info, warn } = logging("stripe-api")

const stripe = new StripeClient()

type ResponseData = {
	received: boolean
}

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = (event) => {
	try {
		switch (event.httpMethod) {
			case "POST": {
				if (!event.body) return BAD_REQUEST()

				const signature = event.headers["stripe-signature"]
				if (typeof signature !== "string") return BAD_REQUEST()

				const stripeEvent = stripe.getWebhookEvent(
					event.body,
					signature
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
		if (error instanceof StripeSignatureVerificationError)
			return BAD_REQUEST()
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
