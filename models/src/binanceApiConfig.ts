import {
  NonEmptyString,
  isNonEmptyString,
  objectTypeGuard,
} from "@ggbot2/type-utils";
import { AccountKey } from "./account.js";
import { ItemKey } from "./item.js";
import { Operation } from "./operation.js";
import { CreationTime, DeletionTime } from "./time.js";

export type BinanceApiConfig = ItemKey<{
  apiKey: NonEmptyString;
  apiSecret: NonEmptyString;
}>;

export const isBinanceApiConfig = objectTypeGuard<BinanceApiConfig>(
  ({ apiKey, apiSecret }) =>
    isNonEmptyString(apiKey) && isNonEmptyString(apiSecret)
);

/** BinanceApiKeyPermissionCriteria defines a set of conditions that validate if a Binance API key can be used with ggbot2.
It is important to notice that withdrawals MUST not be enabled for security reasons. */
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
