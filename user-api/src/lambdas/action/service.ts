import {
	ApiActionHeaders,
	apiActionRequestInit,
	ApiService,
	BinanceClientActionOutput,
	BinanceClientActionType,
	DocumentProviderLevel2,
	isUserActionInput as isInput,
	UserActionType
} from "@workspace/api"
import { UserDatabase } from "@workspace/database"
import { ENV } from "@workspace/env"
import { BadRequestError } from "@workspace/http"
import { BinanceProxyURLs } from "@workspace/locators"
import { AccountKey } from "@workspace/models"

export class Service implements ApiService<UserActionType> {
	accountKey: AccountKey
	dataProvider: UserDatabase
	authorization: string

	constructor({
		accountKey,
		authorization,
		documentProvider
	}: { documentProvider: DocumentProviderLevel2 } & Pick<
		Service,
		"accountKey" | "authorization"
	>) {
		this.accountKey = accountKey
		this.dataProvider = new UserDatabase(accountKey, documentProvider)
		this.authorization = authorization
	}

	CopyStrategy(arg: unknown) {
		if (!isInput.CopyStrategy(arg)) throw new BadRequestError()
		return this.dataProvider.CopyStrategy(arg)
	}

	CreateBinanceApiConfig(arg: unknown) {
		if (!isInput.CreateBinanceApiConfig(arg)) throw new BadRequestError()
		return this.dataProvider.CreateBinanceApiConfig(arg)
	}

	CreatePurchaseOrder(arg: unknown) {
		if (!isInput.CreatePurchaseOrder(arg)) throw new BadRequestError()
		return this.dataProvider.CreatePurchaseOrder(arg)
	}

	CreateStrategy(arg: unknown) {
		if (!isInput.CreateStrategy(arg)) throw new BadRequestError()
		return this.dataProvider.CreateStrategy(arg)
	}

	DeleteAccount() {
		return this.dataProvider.DeleteAccount()
	}

	DeleteBinanceApiConfig() {
		return this.dataProvider.DeleteBinanceApiConfig()
	}

	DeleteStrategy(arg: unknown) {
		if (!isInput.DeleteStrategy(arg)) throw new BadRequestError()
		return this.dataProvider.DeleteStrategy(arg)
	}

	ReadAccountInfo() {
		return this.dataProvider.ReadAccountInfo()
	}

	ReadAccountStrategies() {
		return this.dataProvider.ReadAccountStrategies()
	}

	async ReadBinanceAccountApiRestrictions() {
		const binanceProxy = new BinanceProxyURLs(ENV.BINANCE_PROXY_ORIGIN())
		const headers = new ApiActionHeaders()
		headers.appendAuthorization(this.authorization)
		const options = apiActionRequestInit<BinanceClientActionType>({
			type: "ReadBinanceAccountApiRestrictions",
			headers
		})
		const response = await fetch(binanceProxy.action, options)
		const output: unknown = await response.json()
		if (response.ok)
			return output as BinanceClientActionOutput["ReadBinanceAccountApiRestrictions"]
		// TODO handle errors from binance
		throw new BadRequestError()
	}

	ReadBinanceApiKey() {
		return this.dataProvider.ReadBinanceApiKey()
	}

	ReadStrategyOrders(arg: unknown) {
		if (!isInput.ReadStrategyOrders(arg)) throw new BadRequestError()
		return this.dataProvider.ReadStrategyOrders(arg)
	}

	ReadSubscription() {
		return this.dataProvider.ReadSubscription()
	}

	RenameAccount(arg: unknown) {
		if (!isInput.RenameAccount(arg)) throw new BadRequestError()
		return this.dataProvider.RenameAccount(arg)
	}

	RenameStrategy(arg: unknown) {
		if (!isInput.RenameStrategy(arg)) throw new BadRequestError()
		return this.dataProvider.RenameStrategy(arg)
	}

	SetAccountCountry(arg: unknown) {
		if (!isInput.SetAccountCountry(arg)) throw new BadRequestError()
		return this.dataProvider.SetAccountCountry(arg)
	}

	WriteAccountStrategiesItemSchedulings(arg: unknown) {
		if (!isInput.WriteAccountStrategiesItemSchedulings(arg))
			throw new BadRequestError()
		return this.dataProvider.WriteAccountStrategiesItemSchedulings(arg)
	}

	WriteStrategyFlow(arg: unknown) {
		if (!isInput.WriteStrategyFlow(arg)) throw new BadRequestError()
		return this.dataProvider.WriteStrategyFlow(arg)
	}
}
