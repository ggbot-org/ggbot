import { BinanceExchange, BinanceExchangeInfo, BinanceKline, BinanceKlineOptionalParameters, BinanceNewOrderOptions, BinanceOrderSide, BinanceOrderType, BinanceSymbolInfo, BinanceTickerPrice } from '@workspace/binance'
import { DflowBinanceClient, DflowBinanceKlineInterval } from '@workspace/dflow'
import { Time } from 'minimal-time-helpers'

export declare class BacktestingBinanceClient implements DflowBinanceClient {
	constructor(schedulingInterval: DflowBinanceKlineInterval)

	readonly publicClient: BinanceExchange

	/** The `schedulingInterval` is needed to manage cache. */
	schedulingInterval: DflowBinanceKlineInterval

	/** The `time` used by simulated run. It is needed to manage cache. */
	time: Time
	exchangeInfo(): Promise<BinanceExchangeInfo>
	klines(
		symbol: string,
		interval: DflowBinanceKlineInterval,
		optionalParameters: BinanceKlineOptionalParameters,
	): Promise<BinanceKline[]>
	newOrder(
		symbol: string,
		side: BinanceOrderSide,
		type: Extract<BinanceOrderType, 'MARKET'>,
		orderOptions: BinanceNewOrderOptions,
	): Promise<
		| {
			executedQty: string;
			orderId: number;
			price: string;
			side: 'BUY' | 'SELL';
			status: 'FILLED';
			symbol: string;
			transactTime: number;
			type: 'MARKET';
			fills: {
				commission: string;
				commissionAsset: string;
				price: string;
				qty: string;
			}[];
		}
		| undefined
	>
	symbolInfo(symbol: string): Promise<BinanceSymbolInfo | undefined>
	tickerPrice(symbol: string): Promise<BinanceTickerPrice>
}
