import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import {
	UserClientActionInput as Input,
	UserClientActionOutput as Output,
	UserClientActionType as ActionType
} from "@workspace/api"

const apiOptions: UseActionApiArg = {
	url: api.user.action,
	withAuth: true
}

export const useUserApi = {
	CopyStrategy: () =>
		useAction<ActionType, Input["CopyStrategy"], Output["CopyStrategy"]>(
			apiOptions,
			"CopyStrategy"
		),
	CreateBinanceApiConfig: () =>
		useAction<
			ActionType,
			Input["CreateBinanceApiConfig"],
			Output["CreateBinanceApiConfig"]
		>(apiOptions, "CreateBinanceApiConfig"),
	CreatePurchaseOrder: () =>
		useAction<
			ActionType,
			Input["CreatePurchaseOrder"],
			Output["CreatePurchaseOrder"]
		>(apiOptions, "CreatePurchaseOrder"),
	CreateStrategy: () =>
		useAction<
			ActionType,
			Input["CreateStrategy"],
			Output["CreateStrategy"]
		>(apiOptions, "CreateStrategy"),
	DeleteAccount: () =>
		useAction<ActionType, Input["DeleteAccount"], Output["DeleteAccount"]>(
			apiOptions,
			"DeleteAccount"
		),
	DeleteBinanceApiConfig: () =>
		useAction<
			ActionType,
			Input["DeleteBinanceApiConfig"],
			Output["DeleteBinanceApiConfig"]
		>(apiOptions, "DeleteBinanceApiConfig"),
	DeleteStrategy: () =>
		useAction<
			ActionType,
			Input["DeleteStrategy"],
			Output["DeleteStrategy"]
		>(apiOptions, "DeleteStrategy"),
	ReadAccountInfo: () =>
		useAction<
			ActionType,
			Input["ReadAccountInfo"],
			Output["ReadAccountInfo"]
		>(apiOptions, "ReadAccountInfo"),
	ReadAccountStrategies: () =>
		useAction<
			ActionType,
			Input["ReadAccountStrategies"],
			Output["ReadAccountStrategies"]
		>(apiOptions, "ReadAccountStrategies"),
	ReadBinanceAccountApiRestrictions: () =>
		useAction<
			ActionType,
			Input["ReadBinanceAccountApiRestrictions"],
			Output["ReadBinanceAccountApiRestrictions"]
		>(apiOptions, "ReadBinanceAccountApiRestrictions"),
	ReadBinanceApiKey: () =>
		useAction<
			ActionType,
			Input["ReadBinanceApiKey"],
			Output["ReadBinanceApiKey"]
		>(apiOptions, "ReadBinanceApiKey"),
	// TODO
	// ReadStrategyBalances
	ReadStrategyErrors: () =>
		useAction<
			ActionType,
			Input["ReadStrategyErrors"],
			Output["ReadStrategyErrors"]
		>(apiOptions, "ReadStrategyErrors"),
	ReadStrategyOrders: () =>
		useAction<
			ActionType,
			Input["ReadStrategyOrders"],
			Output["ReadStrategyOrders"]
		>(apiOptions, "ReadStrategyOrders"),
	ReadSubscription: () =>
		useAction<
			ActionType,
			Input["ReadSubscription"],
			Output["ReadSubscription"]
		>(apiOptions, "ReadSubscription"),
	RenameAccount: () =>
		useAction<ActionType, Input["RenameAccount"], Output["RenameAccount"]>(
			apiOptions,
			"RenameAccount"
		),
	RenameStrategy: () =>
		useAction<
			ActionType,
			Input["RenameStrategy"],
			Output["RenameStrategy"]
		>(apiOptions, "RenameStrategy"),
	SetAccountCountry: () =>
		useAction<
			ActionType,
			Input["SetAccountCountry"],
			Output["SetAccountCountry"]
		>(apiOptions, "SetAccountCountry"),
	WriteAccountStrategiesItemSchedulings: () =>
		useAction<
			ActionType,
			Input["WriteAccountStrategiesItemSchedulings"],
			Output["WriteAccountStrategiesItemSchedulings"]
		>(apiOptions, "WriteAccountStrategiesItemSchedulings"),
	WriteStrategyFlow: () =>
		useAction<
			ActionType,
			Input["WriteStrategyFlow"],
			Output["WriteStrategyFlow"]
		>(apiOptions, "WriteStrategyFlow")
}
