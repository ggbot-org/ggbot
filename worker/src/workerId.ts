import { Worker } from "@ggbot2/models";
import { readFile, writeFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { isNodeError } from "./errors.js";

export const storedWorkerIdFile = join(homedir(), ".ggbot2-worker");

/** Read `workerId` from local disc or create a new one if it does not exist. */
export const getWorkerId = async (): Promise<Worker["id"]> => {
  try {
    const workerId = await readFile(storedWorkerIdFile, "utf8");
    return workerId;
  } catch (error) {
    if (isNodeError(error)) {
      if (error.code === "ENOENT") {
        const workerId = uuidv4();
        await writeFile(storedWorkerIdFile, workerId, "utf8");
        return workerId;
      }
    }
    throw error;
  }
};
