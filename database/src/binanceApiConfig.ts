import {
  BinanceApiConfig,
  CacheMap,
  CreateBinanceApiConfig,
  createdNow,
  DeleteBinanceApiConfig,
  isBinanceApiConfig,
  ReadBinanceApiConfig,
  ReadBinanceApiKey,
} from "@ggbot2/models";

import { DELETE, putObject, READ } from "./_dataBucket.js";
import { pathname } from "./locators.js";

const binanceApiConfigCache = new CacheMap<BinanceApiConfig>();

export const createBinanceApiConfig: CreateBinanceApiConfig["func"] = async ({
  accountId,
  apiKey,
  apiSecret,
}) => {
  await putObject(pathname.binanceApiConfig({ accountId }), {
    apiKey,
    apiSecret,
  });
  return createdNow();
};

export const readBinanceApiConfig: ReadBinanceApiConfig["func"] = async ({
  accountId,
}) => {
  const cachedData = binanceApiConfigCache.get(accountId);
  if (cachedData) return cachedData;
  const Key = pathname.binanceApiConfig({ accountId });
  const data = await READ<ReadBinanceApiConfig["out"]>(isBinanceApiConfig, Key);
  if (!data) return null;
  binanceApiConfigCache.set(accountId, data);
  return data;
};

export const readBinanceApiKey: ReadBinanceApiKey["func"] = async ({
  accountId,
}) => {
  const data = await readBinanceApiConfig({ accountId });
  if (!data) return null;
  const { apiKey } = data;
  return { apiKey };
};

export const deleteBinanceApiConfig: DeleteBinanceApiConfig["func"] = (arg) =>
  DELETE(pathname.binanceApiConfig(arg));
