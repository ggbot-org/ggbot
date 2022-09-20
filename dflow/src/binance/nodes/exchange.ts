import {BinanceSymbolInfo} from "@ggbot2/binance";

export const binanceNodeSymbolKind = ({baseAsset, quoteAsset}: Pick<BinanceSymbolInfo, 'baseAsset' | 'quoteAsset'>) => [baseAsset, quoteAsset].join('/')
