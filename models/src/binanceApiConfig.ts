import type { AccountKey } from "./account.js";
import type { Operation } from "./operation.js";
import { CreationTime, DeletionTime } from "./time.js";

export type BinanceApiConfig = {
  apiKey: string;
  apiSecret: string;
};

/**
 * BinanceApiKeyPermissionCriteria defines a set of conditions that
 * validate if a Binance API key can be used with ggbot2.
 *
 * It is important to notice that withdrawals MUST not be enabled for security reasons.
 */
export type BinanceApiKeyPermissionCriteria = {
  enableReading: boolean;
  enableSpotAndMarginTrading: boolean;
  enableWithdrawals: boolean;
  ipRestrict: boolean;
};

export const binanceApiKeyPermissionsAreValid = ({
  enableReading,
  enableSpotAndMarginTrading,
  enableWithdrawals,
  ipRestrict,
}: BinanceApiKeyPermissionCriteria): boolean => {
  if (enableWithdrawals) return false;
  return enableReading && enableSpotAndMarginTrading && ipRestrict;
};

export type CreateBinanceApiConfig = Operation<
  AccountKey & BinanceApiConfig,
  CreationTime
>;

export type ReadBinanceApiConfig = Operation<
  AccountKey,
  BinanceApiConfig | null
>;

export type DeleteBinanceApiConfig = Operation<AccountKey, DeletionTime>;

export type ReadBinanceApiKeyPermissions = Operation<
  AccountKey,
  BinanceApiKeyPermissionCriteria
>;

export type DeleteBinanceApiKeyPermissions = Operation<
  AccountKey,
  DeletionTime
>;
