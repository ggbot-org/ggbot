import {
	isUserApiDataProviderInput as isInput,
	UserApiDataProvider,
	UserApiService} from "@workspace/api"
import { BadRequestError } from "@workspace/http"
import { AccountKey } from "@workspace/models"

export class ApiService implements UserApiService {
	accountKey: AccountKey
	dataProvider: UserApiDataProvider

	constructor(accountKey: AccountKey, dataProvider: UserApiDataProvider) {
		this.accountKey = accountKey
		this.dataProvider = dataProvider
	}

	inputWithAccountKey(arg: unknown): unknown {
		if (!arg) throw new BadRequestError()
		return { ...arg, ...this.accountKey }
	}

	CopyStrategy(arg: unknown) {
		const input = this.inputWithAccountKey(arg)
		if (!isInput.CopyStrategy(input)) throw new BadRequestError()
		return this.dataProvider.copyStrategy(input)
	}

	CreateBinanceApiConfig(arg: unknown) {
		const input = this.inputWithAccountKey(arg)
		if (!isInput.CreateBinanceApiConfig(input)) throw new BadRequestError()
		return this.dataProvider.createBinanceApiConfig(input)
	}

	CreatePurchaseOrder(arg: unknown) {
		const input = this.inputWithAccountKey(arg)
		if (!isInput.CreatePurchaseOrder(input)) throw new BadRequestError()
		return this.dataProvider.createPurchaseOrder(input)
	}

	CreateStrategy(arg: unknown) {
		const input = this.inputWithAccountKey(arg)
		if (!isInput.CreateStrategy(input)) throw new BadRequestError()
		return this.dataProvider.createStrategy(input)
	}

	DeleteAccount() {
		return this.dataProvider.deleteAccount(this.accountKey)
	}

	DeleteBinanceApiConfig() {
		return this.dataProvider.deleteBinanceApiConfig(this.accountKey)
	}

	DeleteStrategy(arg: unknown) {
		const input = this.inputWithAccountKey(arg)
		if (!isInput.DeleteStrategy(input)) throw new BadRequestError()
		return this.dataProvider.deleteStrategy(input)
	}

	ReadAccountInfo() {
		return this.dataProvider.readAccountInfo(this.accountKey)
	}

	ReadAccountStrategies() {
		return this.dataProvider.readAccountStrategies(this.accountKey)
	}

	ReadBinanceApiKey() {
		return this.dataProvider.readBinanceApiKey(this.accountKey)
	}

	ReadBinanceApiKeyPermissions() {
		return this.dataProvider.readBinanceApiKeyPermissions(this.accountKey)
	}

	ReadStrategyBalances(arg: unknown) {
		const input = this.inputWithAccountKey(arg)
		if (!isInput.ReadStrategyBalances(input)) throw new BadRequestError()
		return this.dataProvider.readStrategyBalances(input)
	}

	ReadStrategyOrders(arg: unknown) {
		const input = this.inputWithAccountKey(arg)
		if (!isInput.ReadStrategyOrders(input)) throw new BadRequestError()
		return this.dataProvider.readStrategyOrders(input)
	}

	ReadSubscription() {
		return this.dataProvider.readSubscription(this.accountKey)
	}

	RenameAccount(arg: unknown) {
		const input = this.inputWithAccountKey(arg)
		if (!isInput.RenameAccount(input)) throw new BadRequestError()
		return this.dataProvider.renameAccount(input)
	}

	RenameStrategy(arg: unknown) {
		const input = this.inputWithAccountKey(arg)
		if (!isInput.RenameStrategy(input)) throw new BadRequestError()
		return this.dataProvider.renameStrategy(input)
	}

	SetAccountCountry(arg: unknown) {
		const input = this.inputWithAccountKey(arg)
		if (!isInput.SetAccountCountry(input)) throw new BadRequestError()
		return this.dataProvider.setAccountCountry(input)
	}

	WriteAccountStrategiesItemSchedulings(arg: unknown) {
		const input = this.inputWithAccountKey(arg)
		if (!isInput.WriteAccountStrategiesItemSchedulings(input))
			throw new BadRequestError()
		return this.dataProvider.writeAccountStrategiesItemSchedulings(input)
	}

	WriteStrategyFlow(arg: unknown) {
		const input = this.inputWithAccountKey(arg)
		if (!isInput.WriteStrategyFlow(input)) throw new BadRequestError()
		return this.dataProvider.writeStrategyFlow(input)
	}
}
