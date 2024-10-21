import { APIGatewayProxyHandler, BAD_REQUEST, errorResponse, OK, StripeMetadata } from "@workspace/api"
import { PaymentDatabase } from "@workspace/database"
import { BAD_REQUEST__400, INTERNAL_SERVER_ERROR__500, METHOD_NOT_ALLOWED__405 } from "@workspace/http"
import { newMonthlySubscriptionPurchase, newYearlySubscriptionPurchase, PaymentProvider } from "@workspace/models"
import { documentProvider } from "@workspace/s3-data-bucket"
import { Stripe, StripeClient, StripeSignatureVerificationError } from "@workspace/stripe"
import { getDay, today } from "minimal-time-helpers"

const stripe = new StripeClient()

type ResponseData = {
	received: boolean
}

const received: ResponseData = { received: true }
const notReceived: ResponseData = { received: false }

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (event.httpMethod !== "POST") return errorResponse(METHOD_NOT_ALLOWED__405)

		if (!event.body) return errorResponse(BAD_REQUEST__400)

		const stripeEvent = JSON.parse(event.body) as unknown as Stripe.Event

		const dataProvider = new PaymentDatabase(documentProvider)
		const paymentProvider: PaymentProvider = "stripe"

		if (stripeEvent.type === "checkout.session.completed") {
			const { accountId, plan } = stripeEvent.data.object
				.metadata as StripeMetadata

			const checkout = await stripe.retreiveCheckoutSession(
				stripeEvent.data.object.id
			)
			if (!checkout) return BAD_REQUEST()

			// The `startDay` may be when current subscription ends, if any.
			const subscription = await dataProvider.ReadSubscription({
				accountId
			})
			const startDay = subscription?.end ?? today()

			const { quantity: numMonths, isYearly } = checkout

			const subscriptionPurchase = isYearly
				? newYearlySubscriptionPurchase({ plan, paymentProvider, startDay })
				: newMonthlySubscriptionPurchase({ plan, paymentProvider, numMonths, startDay })

			await dataProvider.WriteSubscriptionPurchase({ accountId, day: today(), purchaseId: subscriptionPurchase.id, ...subscriptionPurchase })

			// Compute the new subscription end day, considering if it is yearly or monthly purchase.
			const subscriptionEnd = isYearly
				? getDay(startDay).plus(1).years
				: getDay(startDay).plus(numMonths).months

			await dataProvider.WriteSubscription({ accountId, plan, end: subscriptionEnd })

			return OK(received)
		} else {
			console.info(stripeEvent)
			console.error(`Unhandled event type: ${stripeEvent.type}`)
		}

		return OK(notReceived)
	} catch (error) {
		if (error instanceof StripeSignatureVerificationError) {
			return errorResponse(BAD_REQUEST__400)
		}

		// Fallback if error is not handled: should not arrive here.
		console.error(error)
		return errorResponse(INTERNAL_SERVER_ERROR__500)
	}
}
