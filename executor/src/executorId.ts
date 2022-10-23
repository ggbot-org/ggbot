import { Executor, isNodeError } from "@ggbot2/models";
import { readFile, writeFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export const executorIdFile = join(homedir(), ".ggbot2-executor");

/**
Read `executorId` from local disc or create a new one if it does not exist.
*/
export const getExecutorId = async (): Promise<Executor["id"]> => {
  try {
    console.info("executorId file", executorIdFile);
    const executorId = await readFile(executorIdFile, "utf8");
    return executorId;
  } catch (error) {
    if (isNodeError(error)) {
      if (error.code === "ENOENT") {
        const executorId = uuidv4();
        await writeFile(executorIdFile, executorId, "utf8");
        return executorId;
      }
    }
    throw error;
  }
};
