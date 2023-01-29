import { AccountKey, Operation } from "@ggbot2/models";
import { BinanceApiKeyPermission } from "./types.js";

export type ReadBinanceApiKeyPermissions = Operation<
  AccountKey,
  BinanceApiKeyPermission
>;
