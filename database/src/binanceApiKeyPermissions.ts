import {
  BinanceCacheMap,
  BinanceClient,
  BinanceConnector,
  ReadBinanceApiKeyPermissions,
} from "@ggbot2/binance";
import { readBinanceApiConfig } from "./binanceApiConfig.js";
import { ErrorAccountItemNotFound } from "./errors.js";

/** @throws {@link ErrorAccountItemNotFound} */
export const readBinanceApiKeyPermissions: ReadBinanceApiKeyPermissions["func"] =
  async ({ accountId }) => {
    const binanceApiConfig = await readBinanceApiConfig({ accountId });
    if (!binanceApiConfig)
      throw new ErrorAccountItemNotFound({
        type: "BinanceApiConfig",
        accountId,
      });
    const { apiKey, apiSecret } = binanceApiConfig;
    const client = new BinanceClient({
      baseUrl: BinanceConnector.defaultBaseUrl,
      apiKey,
      apiSecret,
      cache: new BinanceCacheMap(),
    });
    const data = await client.apiRestrictions();
    return data;
  };
