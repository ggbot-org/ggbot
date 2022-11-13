import {
  BinanceClient,
  BinanceConnector,
  ReadBinanceApiKeyPermissions,
} from "@ggbot2/binance";
import { readBinanceApiConfig } from "./binanceApiConfig.js";
import { ErrorMissingBinanceApiConfig } from "./errors.js";

/** @throws {ErrorMissingBinanceApiConfig} */
export const readBinanceApiKeyPermissions: ReadBinanceApiKeyPermissions["func"] =
  async ({ accountId }) => {
    const binanceApiConfig = await readBinanceApiConfig({ accountId });
    if (!binanceApiConfig)
      throw new ErrorMissingBinanceApiConfig({ accountId });
    const { apiKey, apiSecret } = binanceApiConfig;
    const client = new BinanceClient({
      baseUrl: BinanceConnector.defaultBaseUrl,
      apiKey,
      apiSecret,
    });
    const data = await client.apiRestrictions();
    return data;
  };
