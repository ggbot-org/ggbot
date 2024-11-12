import { ActionInput, ApiService, BadRequestError, BinanceClientActionType, clientAction, ClientActionHeaders, GatewayTimeoutError, GenericError, isApiActionOutputData, isApiActionOutputError, isUserClientActionInput as isInput, TimeoutError, UserClientActionType } from "@workspace/api"
import { UserDatabase } from "@workspace/database"
import { ENV } from "@workspace/env"
import { BinanceProxyURLs } from "@workspace/locators"

export class Service implements ApiService<UserClientActionType> {
	dataProvider: UserDatabase
	authorization: string

	constructor(
		accountKey: ConstructorParameters<typeof UserDatabase>[0],
		documentProvider: ConstructorParameters<typeof UserDatabase>[1],
		authorization: Service["authorization"]
	) {
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

	ReadBalances(arg: unknown) {
		if (!isInput.ReadBalances(arg)) throw new BadRequestError()
		return this.dataProvider.ReadBalances(arg)
	}

	ReadBinanceAccountApiRestrictions() {
		return this.binanceClientAction({ type: "ReadBinanceAccountApiRestrictions" })
	}

	ReadBinanceApiKey() {
		return this.dataProvider.ReadBinanceApiKey()
	}

	ReadStrategies() {
		return this.dataProvider.ReadStrategies()
	}

	ReadStrategyErrors(arg: unknown) {
		if (!isInput.ReadStrategyErrors(arg)) throw new BadRequestError()
		return this.dataProvider.ReadStrategyErrors(arg)
	}

	ReadStrategyOrders(arg: unknown) {
		if (!isInput.ReadStrategyOrders(arg)) throw new BadRequestError()
		return this.dataProvider.ReadStrategyOrders(arg)
	}

	ReadSubscription() {
		return this.dataProvider.ReadSubscription()
	}

	RenameStrategy(arg: unknown) {
		if (!isInput.RenameStrategy(arg)) throw new BadRequestError()
		return this.dataProvider.RenameStrategy(arg)
	}

	WriteAccountStrategiesItemSchedulings(arg: unknown) {
		if (!isInput.WriteAccountStrategiesItemSchedulings(arg)) throw new BadRequestError()
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
			const output = await clientAction<BinanceClientActionType>(binanceProxy.action, headers, { type })
			if (isApiActionOutputData(output)) return output.data
			if (isApiActionOutputError(output)) return output.error
			throw new GenericError()
		} catch (error) {
			if (error instanceof TimeoutError) throw new GatewayTimeoutError()
			throw error
		}
	}
}
