import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils"

import { ApiActionInput } from "./apiAction.js"

export const userApiActionTypes = [
	"CopyStrategy",
	"CreateBinanceApiConfig",
	"CreateStrategy",
	"DeleteAccount",
	"DeleteStrategy",
	"DeleteBinanceApiConfig",
	"ReadAccount",
	"ReadStrategies",
	"ReadBinanceApiKey",
	"ReadBinanceApiKeyPermissions",
	"ReadStrategy",
	"ReadStrategyBalances",
	"ReadStrategyFlow",
	"ReadStrategyOrders",
	"ReadSubscription",
	"RenameStrategy",
	"RenameAccount",
	"SetAccountCountry",
	"WriteStrategiesItemSchedulings",
	"WriteStrategyFlow"
] as const
export type UserApiActionType = (typeof userApiActionTypes)[number]
export const isUserApiActionType =
	isLiteralType<UserApiActionType>(userApiActionTypes)

export type UserApiActionRequestData = ApiActionInput<UserApiActionType>

export const isUserApiActionRequestData =
	objectTypeGuard<UserApiActionRequestData>(({ type }) =>
		isUserApiActionType(type)
	)
