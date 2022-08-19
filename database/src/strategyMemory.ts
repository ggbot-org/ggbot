import {
  AccountStrategyKey,
  DeleteStrategyMemory,
  ReadStrategyMemory,
  StrategyMemory,
  WriteStrategyMemory,
  deletedNow,
  updatedNow,
} from "@ggbot2/models";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { strategyMemoryPathname } from "./_locators.js";
