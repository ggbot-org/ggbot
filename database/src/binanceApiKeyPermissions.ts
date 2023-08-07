import { ReadBinanceApiKeyPermissions } from "@ggbot2/binance";
import { ErrorAccountItemNotFound } from "@ggbot2/models";

import { Binance } from "./binance.js";
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
    const binance = new Binance(apiKey, apiSecret);
    return await binance.privateClient.apiRestrictions();
  };
