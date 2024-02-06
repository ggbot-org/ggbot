import {
	ActionInput,
	ApiService,
	BinanceClientActionType,
	clientAction,
	ClientActionHeaders,
	DocumentProviderLevel2,
	GenericError,
	isApiActionOutputData,
	isApiActionOutputError,
	isUserClientActionInput as isInput,
	TimeoutError,
	UserClientActionType} from "@workspace/api"
import { UserDatabase } from "@workspace/database"
import { ENV } from "@workspace/env"
import { BadRequestError, GatewayTimeoutError } from "@workspace/http"
import { BinanceProxyURLs } from "@workspace/locators"
import { AccountKey } from "@workspace/models"

export class Service implements ApiService<UserClientActionType> {
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
		return this.dataProvider.CreatePurchaseOrder()
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

	ReadBinanceAccountApiRestrictions() {
		return this.binanceClientAction({
			type: "ReadBinanceAccountApiRestrictions"
		})
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

	async binanceClientAction({ type }: ActionInput<BinanceClientActionType>) {
		const binanceProxy = new BinanceProxyURLs(ENV.BINANCE_PROXY_IP())

		const headers = new ClientActionHeaders()
		headers.appendAuthorization(this.authorization)

		try {
			const output = await clientAction<BinanceClientActionType>(
				binanceProxy.action,
				headers,
				{ type }
			)

			if (isApiActionOutputData(output)) return output.data
			if (isApiActionOutputError(output)) return output.error
			throw new GenericError()
		} catch (error) {
			if (error instanceof TimeoutError) throw new GatewayTimeoutError()
			// TODO handle errors from binance
			throw error
		}
	}
}
