/**
 * @typedef {import('./client').DflowBinanceClient} DflowBinanceClient
 * @typedef {import('./client').DflowBinanceClientPrivate} DflowBinanceClientPrivate
 * @typedef {import('./client').DflowBinanceClientPublic} DflowBinanceClientPublic
 */

/** @implements {DflowBinanceClient} */
export class DflowBinanceClientDummy {
	/** @type {DflowBinanceClientPublic['exchangeInfo']} */
	exchangeInfo() {
		return Promise.resolve({ serverTime: 0, symbols: [] })
	}

	/** @type {DflowBinanceClientPublic['klines']} */
	klines() {
		return Promise.resolve([])
	}

	/** @type {DflowBinanceClientPrivate['newOrder']} */
	newOrder(symbol, side, type) {
		return Promise.resolve({
			clientOrderId: '',
			executedQty: '0',
			fills: [
				{ commission: '0', commissionAsset: 'BNB', price: '0', qty: '0', tradeId: -1 }
			],
			orderId: -1,
			price: '0',
			side,
			status: 'FILLED',
			symbol,
			timeInForce: 'GTC',
			transactTime: 0,
			type
		})
	}

	/** @type {DflowBinanceClientPublic['symbolInfo']} */
	symbolInfo() {
		return Promise.resolve(undefined)
	}

	/** @type {DflowBinanceClientPublic['tickerPrice']} */
	tickerPrice(symbol ) {
		return Promise.resolve({ symbol, price: '0' })
	}
}
