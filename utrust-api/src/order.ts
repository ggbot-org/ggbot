import {
	ApiUtrustOrderResponseData,
	isApiUtrustOrderRequestData
} from "@ggbot2/api"
import {
	ALLOWED_METHODS,
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK
} from "@ggbot2/api-gateway"
import {
	createMonthlySubscriptionPurchase,
	createYearlySubscriptionPurchase,
	itemKeyToDirname,
	readSubscription,
	updateSubscriptionPurchaseInfo
} from "@ggbot2/database"
import { ENV, isDev } from "@ggbot2/env"
import {
	ApiBaseURL,
	UserWebappBaseURL,
	UtrustCallbackURL,
	UtrustCancelURL,
	UtrustReturnURL
} from "@ggbot2/locators"
import {
	PaymentProvider,
	purchaseCurrency,
	purchaseMaxNumMonths,
	statusOfSubscription,
	SubscriptionPlan,
	totalPurchase
} from "@ggbot2/models"
import { ApiClient, Customer, Order } from "@utrustdev/utrust-ts-library"
import { getDay, today } from "minimal-time-helpers"

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const DEPLOY_STAGE = ENV.DEPLOY_STAGE()
		const UTRUST_API_KEY = ENV.UTRUST_API_KEY()

		const userWebappBaseURL = new UserWebappBaseURL(DEPLOY_STAGE)
		const apiBaseURL = new ApiBaseURL(DEPLOY_STAGE)
		const callbackUrl = new UtrustCallbackURL(apiBaseURL.toString())
		const cancelUrl = new UtrustCancelURL(userWebappBaseURL.toString())
		const returnUrl = new UtrustReturnURL(userWebappBaseURL.toString())

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
				if (!event.body) return BAD_REQUEST()

				const input = JSON.parse(event.body)
				if (!isApiUtrustOrderRequestData(input)) return BAD_REQUEST()
				if (isDev) console.info(JSON.stringify(input, null, 2))

				const { accountId, country, email, numMonths } = input

				const numDecimals = 2
				const totalNum = totalPurchase(numMonths)
				const totalStr = totalNum.toFixed(numDecimals)
				const plan: SubscriptionPlan = "basic"

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
							name: `Subscription (${
								numMonths >= purchaseMaxNumMonths - 1
									? "1 year"
									: `${numMonths} months`
							})`,
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

				if (isDev) console.info("order", JSON.stringify(order, null, 2))
				if (isDev)
					console.info("customer", JSON.stringify(customer, null, 2))

				const { data } = await createOrder(order, customer)
				if (isDev)
					console.info("created order", JSON.stringify(data, null, 2))

				if (data === null) return BAD_REQUEST()

				const { redirectUrl, uuid } = data

				updateSubscriptionPurchaseInfo({
					...purchaseKey,
					info: { uuid }
				})

				const output: ApiUtrustOrderResponseData = { redirectUrl }
				if (isDev) console.info(JSON.stringify(output, null, 2))
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
