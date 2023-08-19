import { isUserApiActionRequestData as isApiActionRequestData } from "@ggbot2/api"
import {
	ALLOWED_METHODS,
	APIGatewayProxyHandler,
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	METHOD_NOT_ALLOWED,
	OK,
	UNATHORIZED
} from "@ggbot2/api-gateway"
import {
	ErrorUnauthorizedAuthenticationHeader,
	readSessionFromAuthorizationHeader
} from "@ggbot2/authentication"
import { ErrorBinanceBadRequest } from "@ggbot2/binance"
import {
	copyStrategy,
	createBinanceApiConfig,
	createStrategy,
	deleteAccount,
	deleteBinanceApiConfig,
	deleteStrategy,
	readAccount,
	readAccountStrategies,
	readBinanceApiKey,
	readBinanceApiKeyPermissions,
	readStrategyBalances,
	readStrategyOrders,
	readSubscription,
	renameAccount,
	renameStrategy,
	setAccountCountry,
	writeAccountStrategiesItemSchedulings,
	writeStrategyFlow
} from "@ggbot2/database"
import { isDev } from "@ggbot2/env"
import {
	ErrorAccountItemNotFound,
	ErrorExceededQuota,
	ErrorUnimplementedStrategyKind,
	isCopyStrategyInput,
	isCreateBinanceApiConfigInput,
	isCreateStrategyInput,
	isDeleteStrategyInput,
	isReadStrategyBalancesInput,
	isReadStrategyOrdersInput,
	isRenameAccountInput,
	isRenameStrategyInput,
	isSetAccountCountryInput,
	isWriteAccountStrategiesItemSchedulingsInput,
	isWriteStrategyFlowInput
} from "@ggbot2/models"

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		switch (event.httpMethod) {
			case "OPTIONS":
				return ALLOWED_METHODS(["POST"])

			case "POST": {
				if (isDev)
					console.info(
						event.httpMethod,
						JSON.stringify(event.body, null, 2)
					)
				if (!event.body) return BAD_REQUEST()

				const { accountId } = readSessionFromAuthorizationHeader(
					event.headers.Authorization
				)

				const action = JSON.parse(event.body)

				if (!isApiActionRequestData(action)) return BAD_REQUEST()
				const actionData = action.data

				switch (action.type) {
					case "CopyStrategy": {
						if (!actionData) return BAD_REQUEST()
						const input = { accountId, ...actionData }
						if (!isCopyStrategyInput(input)) return BAD_REQUEST()
						const output = await copyStrategy(input)
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "CreateBinanceApiConfig": {
						if (!actionData) return BAD_REQUEST()
						const input = { accountId, ...actionData }
						if (!isCreateBinanceApiConfigInput(input))
							return BAD_REQUEST()
						const output = await createBinanceApiConfig(input)
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "CreateStrategy": {
						if (!actionData) return BAD_REQUEST()
						const input = { accountId, ...actionData }
						if (!isCreateStrategyInput(input)) return BAD_REQUEST()
						const output = await createStrategy(input)
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "DeleteAccount": {
						const output = await deleteAccount({ accountId })
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "DeleteBinanceApiConfig": {
						const output = await deleteBinanceApiConfig({
							accountId
						})
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "DeleteStrategy": {
						if (!actionData) return BAD_REQUEST()
						const input = { accountId, ...actionData }
						if (!isDeleteStrategyInput(input)) return BAD_REQUEST()
						const output = await deleteStrategy(input)
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "ReadAccount": {
						const output = await readAccount({ accountId })
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "ReadStrategies": {
						const output = await readAccountStrategies({
							accountId
						})
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "ReadBinanceApiKey": {
						const output = await readBinanceApiKey({ accountId })
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "ReadBinanceApiKeyPermissions": {
						const output = await readBinanceApiKeyPermissions({
							accountId
						})
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "ReadStrategyBalances": {
						if (!actionData) return BAD_REQUEST()
						const input = { accountId, ...actionData }
						if (!isReadStrategyBalancesInput(input))
							return BAD_REQUEST()
						const output = await readStrategyBalances(input)
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "ReadStrategyOrders": {
						if (!actionData) return BAD_REQUEST()
						const input = { accountId, ...actionData }
						if (!isReadStrategyOrdersInput(input))
							return BAD_REQUEST()
						const output = await readStrategyOrders(input)
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "ReadSubscription": {
						const output = await readSubscription({ accountId })
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "RenameAccount": {
						if (!actionData) return BAD_REQUEST()
						const input = { accountId, ...actionData }
						if (!isRenameAccountInput(input)) return BAD_REQUEST()
						const output = await renameAccount(input)
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "RenameStrategy": {
						if (!actionData) return BAD_REQUEST()
						const input = { accountId, ...actionData }
						if (!isRenameStrategyInput(input)) return BAD_REQUEST()
						const output = await renameStrategy(input)
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "SetAccountCountry": {
						if (!actionData) return BAD_REQUEST()
						const input = { accountId, ...actionData }
						if (!isSetAccountCountryInput(input))
							return BAD_REQUEST()
						const output = await setAccountCountry(input)
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "WriteStrategiesItemSchedulings": {
						if (!actionData) return BAD_REQUEST()
						const input = { accountId, ...actionData }
						if (
							!isWriteAccountStrategiesItemSchedulingsInput(input)
						)
							return BAD_REQUEST()
						const output =
							await writeAccountStrategiesItemSchedulings(input)
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
						return OK(output)
					}

					case "WriteStrategyFlow": {
						if (!actionData) return BAD_REQUEST()
						const input = { accountId, ...actionData }
						if (!isWriteStrategyFlowInput(input))
							return BAD_REQUEST()
						const output = await writeStrategyFlow(input)
						if (isDev)
							console.info(
								action.type,
								JSON.stringify(output, null, 2)
							)
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
		if (
			error instanceof ErrorAccountItemNotFound ||
			error instanceof ErrorBinanceBadRequest ||
			error instanceof ErrorExceededQuota ||
			error instanceof ErrorUnimplementedStrategyKind
		)
			return BAD_REQUEST(error.toObject())
		// Fallback to print error if not handled.
		console.error(error)
	}
	return INTERNAL_SERVER_ERROR
}
