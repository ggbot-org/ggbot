import {
	Event as UtrustEvent,
	WebhookValidator
} from "@utrustdev/utrust-ts-library"
import { UtrustApiCallabackRequestData } from "@workspace/api"
import {
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK
} from "@workspace/api-gateway"
import {
	locatorToItemKey,
	readSubscription,
	readSubscriptionPurchase,
	updateSubscriptionPurchaseStatus,
	writeSubscription
} from "@workspace/database"
import { ENV } from "@workspace/env"

import { info } from "./logging.js"

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		switch (event.httpMethod) {
			case "POST": {
				info(event.httpMethod, JSON.stringify(event.body, null, 2))
				if (!event.body) return BAD_REQUEST()

				const { validateSignature } = WebhookValidator(
					ENV.UTRUST_WEBHOOK_SECRET()
				)
				const input = JSON.parse(event.body)
				const isValid = validateSignature(input)
				if (!isValid) return BAD_REQUEST()

				const {
					event_type,
					resource: { reference }
				} = input as UtrustEvent
				info("input", JSON.stringify(input, null, 2))

				// Nothing to do, the payment is detected on the blockchain.
				if (event_type === "ORDER.PAYMENT.DETECTED") {
					const output: UtrustApiCallabackRequestData = { ok: true }
					return OK(output)
				}

				const purchaseKey =
					locatorToItemKey.subscriptionPurchase(reference)
				if (!purchaseKey) return BAD_REQUEST()

				if (event_type === "ORDER.PAYMENT.RECEIVED") {
					const purchase = await readSubscriptionPurchase(purchaseKey)
					const { accountId } = purchaseKey
					const subscription = await readSubscription({ accountId })

					if (!purchase || !subscription) return BAD_REQUEST()

					const { plan } = subscription
					const { end } = purchase
					await writeSubscription({ accountId, plan, end })

					await updateSubscriptionPurchaseStatus({
						...purchaseKey,
						status: "completed"
					})
				}

				if (event_type === "ORDER.PAYMENT.CANCELLED")
					await updateSubscriptionPurchaseStatus({
						...purchaseKey,
						status: "canceled"
					})

				const output: UtrustApiCallabackRequestData = { ok: false }
				info(JSON.stringify(output, null, 2))
				return OK(output)
			}

			default:
				return METHOD_NOT_ALLOWED
		}
	} catch (error) {
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
