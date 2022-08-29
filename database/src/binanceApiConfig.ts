import { BinanceClient, BinanceConnector } from "@ggbot2/binance";
import {
  BinanceApiConfig,
  CacheMap,
  CreateBinanceApiConfig,
  DeleteBinanceApiConfig,
  DeleteBinanceApiKeyPermissions,
  ReadBinanceApiConfig,
  ReadBinanceApiKeyPermissions,
  createdNow,
  deletedNow,
  BinanceApiKeyPermissionCriteria,
} from "@ggbot2/models";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { binanceApiConfigPathname } from "./_dataBucketLocators.js";
import { ErrorMissingBinanceApiConfig } from "./errors.js";

const binanceApiConfigCache = new CacheMap<BinanceApiConfig>();
const binanceApiKeyPermissionsCache =
  new CacheMap<BinanceApiKeyPermissionCriteria>("ONE_DAY");

export const createBinanceApiConfig: CreateBinanceApiConfig["func"] = async ({
  accountId,
  apiKey,
  apiSecret,
}) => {
  const Key = binanceApiConfigPathname({
    accountId,
  });
  await putObject({ Key, data: { apiKey, apiSecret } });
  return createdNow();
};

export const readBinanceApiConfig: ReadBinanceApiConfig["func"] = async ({
  accountId,
}) => {
  const cachedData = binanceApiConfigCache.get(accountId);
  if (cachedData) return cachedData;
  const data = await getObject<ReadBinanceApiConfig["out"]>({
    Key: binanceApiConfigPathname({ accountId }),
  });
  if (!data) return;
  binanceApiConfigCache.set(accountId, data);
  return data;
};

export const deleteBinanceApiConfig: DeleteBinanceApiConfig["func"] = async (
  _
) => {
  await deleteBinanceApiKeyPermissions(_);
  return await deleteObject({ Key: binanceApiConfigPathname(_) });
};

/**
 * @throws {ErrorMissingBinanceApiConfig}
 */
export const readBinanceApiKeyPermissions: ReadBinanceApiKeyPermissions["func"] =
  async ({ accountId }) => {
    const cached = binanceApiKeyPermissionsCache.get(accountId);
    if (cached) return cached;
    const binanceApiConfig = await readBinanceApiConfig({ accountId });
    if (!binanceApiConfig)
      throw new ErrorMissingBinanceApiConfig({ accountId });
    const baseUrl = BinanceConnector.defaultBaseUrl;
    const { apiKey, apiSecret } = binanceApiConfig;
    const client = new BinanceClient({ baseUrl, apiKey, apiSecret });
    const data = await client.apiRestrictions();
    binanceApiKeyPermissionsCache.set(accountId, data);
    return data;
  };

export const deleteBinanceApiKeyPermissions: DeleteBinanceApiKeyPermissions["func"] =
  async ({ accountId }) =>
    new Promise((resolve) => {
      binanceApiKeyPermissionsCache.delete(accountId);
      resolve(deletedNow());
    });
