import { BinanceProxyApiResponseOutput, isCreateBinanceOrderInput } from "@workspace/api"
import { BinanceApiPrivateEndpoint, ErrorBinanceHTTP } from "@workspace/binance"
import {
	BadRequestError,
	__200__OK__,
	__400__BAD_REQUEST__,
	__404__NOT_FOUND__,
	__500__INTERNAL_SERVER_ERROR__
} from "@workspace/http"
import {ErrorUnknown, SerializableData } from "@workspace/models"

import { warn } from "./logging.js"
import { BinanceDataProvider } from "./binanceDataProvider.js"

export const binanceRequestHandler = async (
	endpoint: BinanceApiPrivateEndpoint
): Promise<BinanceProxyApiResponseOutput<SerializableData>> => {
	const apiKey = "TODO"
	const apiSecret = "TODO"
	const dataProvider = new BinanceDataProvider(apiKey, apiSecret)
	let input = undefined // TODO

			try {
			if (endpoint === "/api/v3/account") {
				const data = await dataProvider.readBinanceAccount()
				return { data, status: __200__OK__ }
			}

			if (endpoint === "/api/v3/order") {
				if (!isCreateBinanceOrderInput(input)) throw new BadRequestError()
					const data = await dataProvider.createBinanceOrder(input)
				return { data, status: __200__OK__ }
			}

			if (endpoint === "/api/v3/order/test") {
				if (!isCreateBinanceOrderInput(input)) throw new BadRequestError()
					const data = await dataProvider.createBinanceOrderTest(input)
				return { data, status: __200__OK__ }
			}

			if (endpoint === "/sapi/v1/account/apiRestrictions") {
				const data = await dataProvider.readBinanceAccountApiRestrictions()
				return { data, status: __200__OK__ }
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
						error: payload?? {
					code: -1,
					msg: statusText
					}
				}
			}

			if (error instanceof BadRequestError)
				return { status: __400__BAD_REQUEST__ }

			if (error instanceof ErrorUnknown)
				return { status: __404__NOT_FOUND__ }

			warn(error)
			return { status: __500__INTERNAL_SERVER_ERROR__ }
		}
}
