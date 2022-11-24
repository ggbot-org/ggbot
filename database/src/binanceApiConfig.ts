import {
  BinanceApiConfig,
  CacheMap,
  CreateBinanceApiConfig,
  DeleteBinanceApiConfig,
  ReadBinanceApiConfig,
  createdNow,
} from "@ggbot2/models";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

const binanceApiConfigCache = new CacheMap<BinanceApiConfig>();

export const createBinanceApiConfig: CreateBinanceApiConfig["func"] = async ({
  accountId,
  apiKey,
  apiSecret,
}) => {
  const Key = pathname.binanceApiConfig({ accountId });
  await putObject({ Key, data: { apiKey, apiSecret } });
  return createdNow();
};

export const readBinanceApiConfig: ReadBinanceApiConfig["func"] = async ({
  accountId,
}) => {
  const cachedData = binanceApiConfigCache.get(accountId);
  if (cachedData) return cachedData;
  const Key = pathname.binanceApiConfig({ accountId });
  const data = await getObject<ReadBinanceApiConfig["out"]>({ Key });
  if (!data) return null;
  binanceApiConfigCache.set(accountId, data);
  return data;
};

export const deleteBinanceApiConfig: DeleteBinanceApiConfig["func"] = async ({
  accountId,
}) => await deleteObject({ Key: pathname.binanceApiConfig({ accountId }) });
