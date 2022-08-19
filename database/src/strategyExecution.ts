import {
  AccountStrategyKey,
  DeleteStrategyExecution,
  ReadStrategyExecution,
  StrategyExecution,
  WriteStrategyExecution,
  deletedNow,
  updatedNow,
} from "@ggbot2/models";
import { deleteObject, getObject, putObject } from "./_dataBucket.js";
import { strategyExecutionPathname } from "./_locators.js";
