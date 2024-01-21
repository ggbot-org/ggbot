import { BinanceApiDataProvider, CreateBinanceOrderInput } from "@workspace/api"
import { BinanceApiPrivateEndpoint, ErrorBinanceHTTP } from "@workspace/binance"
import { BinanceClient } from "@workspace/binance-client"
import {
	__200__OK__,
	__404__NOT_FOUND__,
	__500__INTERNAL_SERVER_ERROR__
} from "@workspace/http"
import { ErrorUnknown } from "@workspace/models"

import { warn } from "./logging.js"

export class BinanceDataProvider implements BinanceApiDataProvider {
	binance: BinanceClient

	constructor(apiKey: string, apiSecret: string) {
		this.binance = new BinanceClient(apiKey, apiSecret)
	}

	async action(endpoint: BinanceApiPrivateEndpoint) {
		try {
			if (endpoint === "/api/v3/account") {
				const data = await this.readBinanceAccount()
				return { data, status: __200__OK__ }
			}
			if (endpoint === "/api/v3/order") {
				return { status: __200__OK__ }
			}
			if (endpoint === "/api/v3/order/test") {
				return { status: __200__OK__ }
			}
			if (endpoint === "/sapi/v1/account/apiRestrictions") {
				const data = await this.readBinanceAccountApiRestrictions()
				return { data, status: __200__OK__ }
			}

			throw new ErrorUnknown("endpoint", endpoint)
		} catch (error) {
			if (error instanceof ErrorBinanceHTTP) {
				const {
					info: { status, statusText },
					payload
				} = error
				if (payload)
					return {
						status,
						...payload
					}
				return {
					status,
					code: -1,
					msg: statusText
				}
			}

			if (error instanceof ErrorUnknown)
				return { status: __404__NOT_FOUND__ }

			warn(error)
			return { status: __500__INTERNAL_SERVER_ERROR__ }
		}
	}

	createBinanceOrder({
		symbol,
		side,
		type,
		orderOptions
	}: CreateBinanceOrderInput) {
		return this.binance.newOrder(symbol, side, type, orderOptions)
	}

	createBinanceOrderTest({
		symbol,
		side,
		type,
		orderOptions
	}: CreateBinanceOrderInput) {
		return this.binance.newOrderTest(symbol, side, type, orderOptions)
	}

	readBinanceAccount() {
		return this.binance.account()
	}

	readBinanceAccountApiRestrictions() {
		return this.binance.apiRestrictions()
	}
}
