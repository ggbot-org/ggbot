import { UserApiDataProvider, UserApiService } from "@workspace/api"
import { BadRequestError } from "@workspace/http"
import {
	AccountKey,
	isCopyStrategyInput,
	isCreateBinanceApiConfigInput,
	isCreateStrategyInput,
	isReadStrategyBalancesInput,
	isReadStrategyOrdersInput,
	isRenameAccountInput,
	isRenameStrategyInput,
	isSetAccountCountryInput,
	isWriteAccountStrategiesItemSchedulingsInput,
	isWriteStrategyFlowInput
} from "@workspace/models"

export class ApiService implements UserApiService {
	accountKey: AccountKey
	dataProvider: UserApiDataProvider

	constructor(accountKey: AccountKey, dataProvider: UserApiDataProvider) {
		this.accountKey = accountKey
		this.dataProvider = dataProvider
	}

	CopyStrategy(arg: unknown) {
		if (!isCopyStrategyInput(arg)) throw new BadRequestError()
		return this.dataProvider.copyStrategy(arg)
	}

	CreateBinanceApiConfig(arg: unknown) {
		if (!isCreateBinanceApiConfigInput(arg)) throw new BadRequestError()
		return this.dataProvider.createBinanceApiConfig(arg)
	}

	CreateStrategy(arg: unknown) {
		if (!isCreateStrategyInput(arg)) throw new BadRequestError()
		return this.dataProvider.createStrategy(arg)
	}

	DeleteAccount() {
		return this.dataProvider.deleteAccount(this.accountKey)
	}

	DeleteBinanceApiConfig() {
		return this.dataProvider.deleteBinanceApiConfig(this.accountKey)
	}

	DeleteStrategy() {
		return this.dataProvider.deleteBinanceApiConfig(this.accountKey)
	}

	ReadAccount() {
		return this.dataProvider.readAccount(this.accountKey)
	}

	ReadAccountStrategies() {
		return this.dataProvider.readAccountStrategies(this.accountKey)
	}

	ReadBinanceApiKey() {
		return this.dataProvider.readBinanceApiKey(this.accountKey)
	}

	ReadBinanceApiKeyPermissions() {
		return this.dataProvider.readBinanceApiKey(this.accountKey)
	}

	ReadStrategyBalances(arg: unknown) {
		if (!arg) throw new BadRequestError()
		const input = { ...this.accountKey, ...arg }
		if (!isReadStrategyBalancesInput(input)) throw new BadRequestError()
		return this.dataProvider.readStrategyBalances(input)
	}

	ReadStrategyOrders(arg: unknown) {
		if (!arg) throw new BadRequestError()
		const input = { ...this.accountKey, ...arg }
		if (!isReadStrategyOrdersInput(input)) throw new BadRequestError()
		return this.dataProvider.readStrategyOrders(input)
	}

	ReadSubscription() {
		return this.dataProvider.readSubscription(this.accountKey)
	}

	RenameAccount(arg: unknown) {
		if (!arg) throw new BadRequestError()
		const input = { ...this.accountKey, ...arg }
		if (!isRenameAccountInput(input)) throw new BadRequestError()
		return this.dataProvider.renameAccount(input)
	}

	RenameStrategy(arg: unknown) {
		if (!arg) throw new BadRequestError()
		const input = { ...this.accountKey, ...arg }
		if (!isRenameStrategyInput(input)) throw new BadRequestError()
		return this.dataProvider.renameStrategy(input)
	}

	SetAccountCountry(arg: unknown) {
		if (!arg) throw new BadRequestError()
		const input = { ...this.accountKey, ...arg }
		if (!isSetAccountCountryInput(input)) throw new BadRequestError()
		return this.dataProvider.setAccountCountry(input)
	}

	WriteAccountStrategiesItemSchedulings(arg: unknown) {
		if (!arg) throw new BadRequestError()
		const input = { ...this.accountKey, ...arg }
		if (!isWriteAccountStrategiesItemSchedulingsInput(input))
			throw new BadRequestError()
		return this.dataProvider.writeAccountStrategiesItemSchedulings(input)
	}

	WriteStrategyFlow(arg: unknown) {
		if (!arg) throw new BadRequestError()
		const input = { ...this.accountKey, ...arg }
		if (!isWriteStrategyFlowInput(input)) throw new BadRequestError()
		return this.dataProvider.writeStrategyFlow(input)
	}
}
