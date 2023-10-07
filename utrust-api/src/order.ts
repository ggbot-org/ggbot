import { ApiClient, Customer, Order } from "@utrustdev/utrust-ts-library"
import {
	isUtrustApiOrderRequestData,
	UtrustApiOrderResponseData
} from "@workspace/api"
import {
	ALLOWED_METHODS,
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK,
	UNATHORIZED
} from "@workspace/api-gateway"
import {
	ErrorUnauthorizedAuthenticationHeader,
	readSessionFromAuthorizationHeader
} from "@workspace/authentication"
import {
	createMonthlySubscriptionPurchase,
	createYearlySubscriptionPurchase,
	itemKeyToDirname,
	readSubscription,
	updateSubscriptionPurchaseInfo
} from "@workspace/database"
import { ENV } from "@workspace/env"
import {
	ApiBaseURL,
	FQDN,
	UtrustCallbackURL,
	UtrustCancelURL,
	UtrustReturnURL,
	WebappBaseURL
} from "@workspace/locators"
import {
	PaymentProvider,
	purchaseCurrency,
	purchaseMaxNumMonths,
	statusOfSubscription,
	totalPurchase
} from "@workspace/models"
import { getDay, today } from "minimal-time-helpers"

import { info } from "./logging.js"

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const fqdn = new FQDN(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN())
		const webappBaseURL = new WebappBaseURL(fqdn)
		const apiBaseURL = new ApiBaseURL(fqdn)
		const callbackUrl = new UtrustCallbackURL(apiBaseURL.toString())
		const cancelUrl = new UtrustCancelURL(webappBaseURL.toString())
		const returnUrl = new UtrustReturnURL(webappBaseURL.toString())

		const UTRUST_API_KEY = ENV.UTRUST_API_KEY()
		// UTRUST_API_KEY starts with
		// - u_test_api_ on sandbox environment
		// - u_live_api_ on production environment
		const UTRUST_ENVIRONMENT = UTRUST_API_KEY.startsWith("u_live")
			? "production"
			: "sandbox"

		const { createOrder } = ApiClient(UTRUST_API_KEY, UTRUST_ENVIRONMENT)

		switch (event.httpMethod) {
			case "OPTIONS":
				return ALLOWED_METHODS(["POST"])

			case "POST": {
				info(event.httpMethod, JSON.stringify(event.body, null, 2))
				if (!event.body) return BAD_REQUEST()

				const { accountId } = readSessionFromAuthorizationHeader(
					event.headers.Authorization
				)

				const input = JSON.parse(event.body)
				if (!isUtrustApiOrderRequestData(input)) return BAD_REQUEST()
				info(JSON.stringify(input, null, 2))

				const { country, email, itemName, numMonths, plan } = input

				const numDecimals = 2
				const totalNum = totalPurchase(numMonths)
				const totalStr = totalNum.toFixed(numDecimals)

				const paymentProvider: PaymentProvider = "utrust"

				const subscription = await readSubscription({ accountId })
				const startDay =
					subscription &&
					statusOfSubscription(subscription) === "active"
						? getDay(subscription.end).plusOne.day
						: today()

				const purchaseKey =
					numMonths >= purchaseMaxNumMonths - 1
						? await createYearlySubscriptionPurchase({
								accountId,
								paymentProvider,
								plan,
								startDay
						  })
						: await createMonthlySubscriptionPurchase({
								accountId,
								numMonths,
								paymentProvider,
								plan,
								startDay
						  })

				// Save reference as stringified purchaseKey.
				const reference =
					itemKeyToDirname.subscriptionPurchase(purchaseKey)

				const order: Order = {
					reference,
					amount: {
						currency: purchaseCurrency,
						total: totalStr
					},
					return_urls: {
						callback_url: callbackUrl.toString(),
						cancel_url: cancelUrl.toString(),
						return_url: returnUrl.toString()
					},
					line_items: [
						{
							currency: purchaseCurrency,
							name: itemName,
							price: totalStr,
							quantity: 1,
							sku: plan
						}
					]
				}

				const customer: Customer = {
					country,
					email
				}

				info("order", JSON.stringify(order, null, 2))
				info("customer", JSON.stringify(customer, null, 2))

				const { data } = await createOrder(order, customer)
				info("created order", JSON.stringify(data, null, 2))

				if (data === null) return BAD_REQUEST()

				const { redirectUrl, uuid } = data

				updateSubscriptionPurchaseInfo({
					...purchaseKey,
					info: { uuid }
				})

				const output: UtrustApiOrderResponseData = { redirectUrl }
				info(JSON.stringify(output, null, 2))
				return OK(output)
			}

			default:
				return METHOD_NOT_ALLOWED
		}
	} catch (error) {
		if (error instanceof ErrorUnauthorizedAuthenticationHeader)
			return UNATHORIZED
		// Fallback to print error if not handled.
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
