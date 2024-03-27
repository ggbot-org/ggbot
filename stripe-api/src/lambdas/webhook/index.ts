import { StripeMetadata } from "@workspace/api"
import {
	APIGatewayProxyHandler,
	BAD_REQUEST,
	errorResponse,
	OK
} from "@workspace/api-gateway"
import { PaymentDatabase } from "@workspace/database"
import {
	BAD_REQUEST__400,
	INTERNAL_SERVER_ERROR__500,
	METHOD_NOT_ALLOWED__405
} from "@workspace/http"
import { logging } from "@workspace/logging"
import {
	newMonthlySubscription,
	newYearlySubscription,
	PaymentProvider
} from "@workspace/models"
import { documentProvider } from "@workspace/s3-data-bucket"
import {
	StripeClient,
	StripeSignatureVerificationError
} from "@workspace/stripe"
import { today } from "minimal-time-helpers"

const { info, debug } = logging("stripe-api")

const stripe = new StripeClient()

type ResponseData = {
	received: boolean
}

const received: ResponseData = { received: true }
const notReceived: ResponseData = { received: false }

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (event.httpMethod !== "POST")
			return errorResponse(METHOD_NOT_ALLOWED__405)

		if (!event.body) return errorResponse(BAD_REQUEST__400)

		const signature = event.headers["stripe-signature"]
		if (typeof signature !== "string")
			return errorResponse(BAD_REQUEST__400)

		const stripeEvent = stripe.getWebhookEvent(event.body, signature)

		info(stripeEvent)

		const dataProvider = new PaymentDatabase(documentProvider)
		const paymentProvider: PaymentProvider = "stripe"

		if (stripeEvent.type === "payment_intent.succeeded") {
			if (stripeEvent.data.object.status === "succeeded") {
				const { accountId, plan } = stripeEvent.data.object
					.metadata as StripeMetadata

				const checkout = await stripe.retreiveCheckoutSession(
					stripeEvent.data.object.id
				)
				if (!checkout) return BAD_REQUEST()

				// TODO read current subscription, startDay may be when it ends + one day.
				const startDay = today()

				const subscriptionPurchase = checkout.isYearly
					? newYearlySubscription({
							plan,
							paymentProvider,
							startDay
					  })
					: newMonthlySubscription({
							plan,
							paymentProvider,
							numMonths: checkout.quantity,

							startDay
					  })

				await dataProvider.WriteSubscriptionPurchase({
					accountId,
					day: today(),
					purchaseId: subscriptionPurchase.id,
					...subscriptionPurchase
				})

				return OK(received)
			}
			return OK(received)
		}

		return OK(notReceived)
	} catch (error) {
		if (error instanceof StripeSignatureVerificationError)
			return errorResponse(BAD_REQUEST__400)

		// Fallback to print error if not handled.
		debug(error)
		return errorResponse(INTERNAL_SERVER_ERROR__500)
	}
}
