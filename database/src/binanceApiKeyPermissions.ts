import { ReadBinanceApiKeyPermissions } from "@ggbot2/binance";
import { ErrorAccountItemNotFound } from "@ggbot2/models";

import { _BinanceClient } from "./_binanceClient.js";
import { readBinanceApiConfig } from "./binanceApiConfig.js";

export const readBinanceApiKeyPermissions: ReadBinanceApiKeyPermissions["func"] =
  async ({ accountId }) => {
    const binanceApiConfig = await readBinanceApiConfig({ accountId });
    if (!binanceApiConfig)
      throw new ErrorAccountItemNotFound({
        type: "BinanceApiConfig",
        accountId,
      });
    const { apiKey, apiSecret } = binanceApiConfig;
    const binance = new _BinanceClient(apiKey, apiSecret);
    return await binance.privateClient.apiRestrictions();
  };
