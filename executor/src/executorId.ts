import { Executor, isNodeError, newId } from "@ggbot2/models";
import { readFile, writeFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";

export const executorIdFile = join(homedir(), ".ggbot2-executor");

/**
 * Read `executorId` from local disc or create a new one if it does not exist.
 */
export const getExecutorId = async (): Promise<Executor["id"]> => {
  try {
    const executorId = await readFile(executorIdFile, "utf8");
    return executorId;
  } catch (error) {
    if (isNodeError(error)) {
      if (error.code === "ENOENT") {
        const executorId = newId();
        await writeFile(executorIdFile, executorId, "utf8");
        return executorId;
      }
    }
    throw error;
  }
};
