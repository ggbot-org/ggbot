import { ApiClient, Customer, Order } from "@utrustdev/utrust-ts-library"
import { isUtrustApiActionRequestData as isApiActionRequestData } from "@workspace/api"
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
import { DeployStage, ENV } from "@workspace/env"
import {
	ApiBaseURL,
	FQDN,
	UtrustCallbackURL,
	UtrustCancelURL,
	UtrustReturnURL,
	WebappBaseURL
} from "@workspace/locators"
import { logging } from "@workspace/logging"
import {
	CreateUtrustOrder,
	isCreateUtrustOrderInput,
	PaymentProvider,
	purchaseCurrency,
	purchaseMaxNumMonths,
	statusOfSubscription,
	totalPurchase
} from "@workspace/models"
import { getDay, today } from "minimal-time-helpers"

const { info, warn } = logging("utrust")

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()
// If deployStage is "local", set it to "next".
// Both `cancelUrl` and `returnUrl` cannot point to localhost.
const deployStage: DeployStage =
	DEPLOY_STAGE === "local" ? "next" : DEPLOY_STAGE

const fqdn = new FQDN(deployStage, ENV.DNS_DOMAIN())
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

const createUtrustOrder: CreateUtrustOrder = async ({
	accountId,
	country,
	email,
	itemName,
	numMonths,
	plan
}) => {
	const numDecimals = 2
	const totalNum = totalPurchase(numMonths)
	const total = totalNum.toFixed(numDecimals)

	const paymentProvider: PaymentProvider = "utrust"

	const subscription = await readSubscription({ accountId })
	const startDay =
		subscription && statusOfSubscription(subscription) === "active"
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
	const reference = itemKeyToDirname.subscriptionPurchase(purchaseKey)

	const order: Order = {
		reference,
		amount: {
			currency: purchaseCurrency,
			total
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
				price: total,
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

	const { data, status, errors } = await createOrder(order, customer)

	if (data === null) {
		warn("could not create order", status, errors)
		return null
	}

	info("created order", JSON.stringify(data, null, 2))

	const { redirectUrl, uuid } = data

	if (typeof redirectUrl !== "string") return null

	await updateSubscriptionPurchaseInfo({
		...purchaseKey,
		// Account could change country and even email after purchasing.
		info: { country, email, total, uuid }
	})

	return { redirectUrl }
}

// ts-prune-ignore-next
export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		switch (event.httpMethod) {
			case "OPTIONS":
				return ALLOWED_METHODS(["POST"])

			case "POST": {
				if (!event.body) return BAD_REQUEST()

				const { accountId } = readSessionFromAuthorizationHeader(
					event.headers.Authorization
				)

				const action = JSON.parse(event.body)

				if (!isApiActionRequestData(action)) return BAD_REQUEST()
				const actionData = action.data

				switch (action.type) {
					case "CreateUtrustOrder": {
						if (!actionData) return BAD_REQUEST()
						const input = { accountId, ...actionData }
						if (!isCreateUtrustOrderInput(input))
							return BAD_REQUEST()
						const output = await createUtrustOrder(input)
						info(action.type, JSON.stringify(output, null, 2))
						if (output === null) return BAD_REQUEST()
						return OK(output)
					}

					default:
						return BAD_REQUEST()
				}
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
