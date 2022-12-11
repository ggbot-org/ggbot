import { exit } from "node:process";
import { getExecutorId } from "./executorId.js";
import { log } from "./log.js";
import { executorTasks } from "./tasks.js";

export async function spawnExecutorDaemon() {
  let executorId;
  try {
    executorId = await getExecutorId();
  } catch (error) {
    log.error(error);
    exit(1);
  }

  log.info("executorId", executorId);

  let canRun = true;
  let gotSIGINT = false;
  let gotSIGHUP = false;
  let gotSIGTERM = false;

  const terminate = () => {
    log.info("terminating");
    canRun = false;
  };

  process.on("SIGHUP", () => {
    if (gotSIGHUP) return;
    gotSIGHUP = true;
    log.info("got SIGHUP");
  });

  process.on("SIGINT", () => {
    if (gotSIGINT) return;
    gotSIGINT = true;
    log.info("got SIGINT");
    terminate();
  });

  process.on("SIGTERM", () => {
    if (gotSIGTERM) return;
    gotSIGTERM = true;
    log.info("got SIGTERM");
    terminate();
  });

  // The `while` loop must be last statement.
  while (canRun) {
    try {
      await executorTasks();
    } catch (error) {
      console.error(error);
    }
  }
}
