import {
	APIGatewayProxyHandler,
	errorResponse,
	OK
} from "@workspace/api-gateway"
import {
	BAD_REQUEST__400,
	INTERNAL_SERVER_ERROR__500,
	METHOD_NOT_ALLOWED__405
} from "@workspace/http"
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

const received: ResponseData = { received: true }
const notReceived: ResponseData = { received: false }

// @ts-expect-error TODO use async/await ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = (event) => {
	try {
		if (event.httpMethod !== "POST")
			return errorResponse(METHOD_NOT_ALLOWED__405)

		if (!event.body) return errorResponse(BAD_REQUEST__400)

		const signature = event.headers["stripe-signature"]
		if (typeof signature !== "string")
			return errorResponse(BAD_REQUEST__400)

		const stripeEvent = stripe.getWebhookEvent(event.body, signature)

		info(stripeEvent)

		if (stripeEvent.type === "payment_intent.succeeded") {
			return OK(received)
		}

		return OK(notReceived)
	} catch (error) {
		if (error instanceof StripeSignatureVerificationError)
			return errorResponse(BAD_REQUEST__400)

		// Fallback to print error if not handled.
		warn(error)
		return errorResponse(INTERNAL_SERVER_ERROR__500)
	}
}
