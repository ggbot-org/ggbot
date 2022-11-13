import type { AccountKey, Operation } from "@ggbot2/models";
import type { BinanceApiKeyPermission } from "./types.js";

export type ReadBinanceApiKeyPermissions = Operation<
  AccountKey,
  BinanceApiKeyPermission
>;
