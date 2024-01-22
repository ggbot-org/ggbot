import {
	BinanceProxyApiResponseError,
	BinanceProxyApiResponseOutput,
	isCreateBinanceOrderInput
} from "@workspace/api"
import { ErrorBinanceHTTP } from "@workspace/binance"
import { readBinanceApiConfig } from "@workspace/database"
import {
	__200__OK__,
	__400__BAD_REQUEST__,
	__404__NOT_FOUND__,
	__500__INTERNAL_SERVER_ERROR__,
	BadRequestError} from "@workspace/http"
import { BinanceProxyPathname } from "@workspace/locators"
import {
	AccountKey,
	ErrorAccountItemNotFound,
	ErrorUnknown,
	SerializableData
} from "@workspace/models"

import { BinanceDataProvider } from "./binanceDataProvider.js"
import { warn } from "./logging.js"

export const binanceRequestHandler = async (
	endpoint: BinanceProxyPathname,
	{ accountId }: AccountKey,
	input?: SerializableData
): Promise<
	| BinanceProxyApiResponseOutput<SerializableData>
	| BinanceProxyApiResponseError
	| Pick<Response, "status">
> => {
	const binanceApiConfig = await readBinanceApiConfig({ accountId })
	if (!binanceApiConfig)
		throw new ErrorAccountItemNotFound({
			type: "BinanceApiConfig",
			accountId
		})
	const { apiKey, apiSecret } = binanceApiConfig
	const dataProvider = new BinanceDataProvider(apiKey, apiSecret)

	try {
		if (endpoint === "/order") {
			if (!isCreateBinanceOrderInput(input)) throw new BadRequestError()
			const data = await dataProvider.createBinanceOrder(input)
			return { data }
		}

		if (endpoint === "/apiRestrictions") {
			const data = await dataProvider.readBinanceAccountApiRestrictions()
			return { data }
		}

		throw new ErrorUnknown("endpoint", endpoint)
	} catch (error) {
		if (error instanceof ErrorBinanceHTTP) {
			const {
				info: { status, statusText },
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
			return { status: __400__BAD_REQUEST__ }

		if (error instanceof ErrorUnknown) return { status: __404__NOT_FOUND__ }

		warn(error)
		return { status: __500__INTERNAL_SERVER_ERROR__ }
	}
}
