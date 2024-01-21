import { BinanceProxyApiDataProvider, CreateBinanceOrderInput, ReadBinanceApiKeyPermissions, isBinanceProxyApiResponseError } from "@workspace/api"
import {  BinanceAccountInformation, BinanceOrderRespFULL, BinanceApiPrivateEndpoint, ErrorBinanceHTTP } from "@workspace/binance"
import { ENV } from "@workspace/env"
import {NotImplementedError} from "@workspace/http"
import {AccountKey, BinanceApiKeyPermissionCriteria, isBinanceApiKeyPermissionCriteria} from "@workspace/models"

class BinanceProxyClient implements BinanceProxyApiDataProvider {
	accountKey: AccountKey
			baseUrl = ENV.BINANCE_API_BASE_URL()

	constructor(accountKey: BinanceProxyClient['accountKey']) {
		this.accountKey = accountKey
	}

	createBinanceOrder(_arg: CreateBinanceOrderInput): Promise<BinanceOrderRespFULL> {
		throw new NotImplementedError()
	}

	createBinanceOrderTest(_arg: CreateBinanceOrderInput): Promise<BinanceOrderRespFULL> {
		throw new NotImplementedError()
	}

	readBinanceAccount(): Promise<BinanceAccountInformation> {
		throw new NotImplementedError()
	}

	async readBinanceAccountApiRestrictions(): Promise<BinanceApiKeyPermissionCriteria> {
		const endpoint:BinanceApiPrivateEndpoint = "/sapi/v1/account/apiRestrictions"
		const url = new URL(endpoint, this.baseUrl)
		const response = await fetch(url, {method: "POST"})
		if (!response.ok) {
	const errorData = await response.json()
	if (isBinanceProxyApiResponseError(errorData)) {
		const {error: errorPayload, status: errorStatus } = errorData
	throw new ErrorBinanceHTTP({status: errorStatus, statusText: response.statusText, pathname:endpoint, searchParams: ""}, errorPayload)
	}
		}
		const data = await response.json()
		if (isBinanceApiKeyPermissionCriteria(data)) return data
			// Fallback to an ErrorBinanceHTTP without payload.
	throw new ErrorBinanceHTTP({status: response.status, statusText: response.statusText, pathname:endpoint, searchParams: ""})
	}
}

export const readBinanceApiKeyPermissions: ReadBinanceApiKeyPermissions =
	(accountKey) => {
		const binance = new BinanceProxyClient( accountKey)
		return binance.readBinanceAccountApiRestrictions()
	}
