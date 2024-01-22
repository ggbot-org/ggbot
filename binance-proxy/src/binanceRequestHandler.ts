import {
	BinanceProxyApiResponseOutput,
	isBinanceProxyApiInput as isInput
} from "@workspace/api"
import {BinanceApiPrivateEndpoint, ErrorBinanceHTTP} from "@workspace/binance"
import {readBinanceApiConfig} from "@workspace/database"
import {
	BadRequestError,
	__200__OK__,
	__400__BAD_REQUEST__,
	__404__NOT_FOUND__,
	__500__INTERNAL_SERVER_ERROR__
} from "@workspace/http"
import {ErrorAccountItemNotFound, ErrorUnknown, SerializableData} from "@workspace/models"

import {warn} from "./logging.js"
import {BinanceDataProvider} from "./binanceDataProvider.js"
import {BinanceProxyApiResponseError} from "@workspace/api/dist/binanceProxyApi.js"

export const binanceRequestHandler = async (
	endpoint: BinanceApiPrivateEndpoint
): Promise<BinanceProxyApiResponseOutput<SerializableData> | BinanceProxyApiResponseError | Pick<Response, 'status'>> => {
	const accountId = 'TODO'
	let input = undefined // TODO

	const binanceApiConfig = await readBinanceApiConfig({accountId})
	if (!binanceApiConfig)
		throw new ErrorAccountItemNotFound({
			type: "BinanceApiConfig",
			accountId
		})
	const {apiKey, apiSecret} = binanceApiConfig
	const dataProvider = new BinanceDataProvider(apiKey, apiSecret)

	try {
		if (endpoint === "/api/v3/account") {
			const data = await dataProvider.readBinanceAccount()
			return {data}
		}

		if (endpoint === "/api/v3/order") {
			if (!isInput.CreateBinanceOrder(input)) throw new BadRequestError()
			const data = await dataProvider.createBinanceOrder(input)
			return {data}
		}

		if (endpoint === "/sapi/v1/account/apiRestrictions") {
			const data = await dataProvider.readBinanceAccountApiRestrictions()
			return {data}
		}

		throw new ErrorUnknown("endpoint", endpoint)
	} catch (error) {
		if (error instanceof ErrorBinanceHTTP) {
			const {
				info: {status, statusText},
				payload
			} = error
			return {
				status,
				error: payload ?? {
					code: -1,
					msg: statusText
				}
			}
		}

		if (error instanceof BadRequestError)
			return {status: __400__BAD_REQUEST__, }

		if (error instanceof ErrorUnknown) return {status: __404__NOT_FOUND__}

		warn(error)
		return {status: __500__INTERNAL_SERVER_ERROR__}
	}
}
