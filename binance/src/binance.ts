import {
  BinanceAccountInformation,
  BinanceApiKeyPermission,
  BinanceExchangeInfo,
  BinanceNewOrder,
  BinanceNewOrderOptionsWithRespType,
  BinanceOrderRespType,
} from "./types.js";

export interface Binance {
  // public API
  exchangeInfo(): Promise<BinanceExchangeInfo>;
  apiRestrictions(): Promise<BinanceApiKeyPermission>;

  // private API
  account(): Promise<BinanceAccountInformation>;
  newOrder<RespType extends BinanceOrderRespType>(
    symbol: string,
    side: string,
    type: string,
    orderOptions: BinanceNewOrderOptionsWithRespType<RespType>
  ): Promise<BinanceNewOrder<RespType>>;
}
