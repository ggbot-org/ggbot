import { exit } from "node:process";

import { Executor } from "./Executor.js";
import { log } from "./log.js";

const sleep = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

async function start() {
  // TODO if it is a dedicated server, it will run only strategies of one account
  // how to get the account id?
  const capacity = 1;
  const hostIndex = 0;
  // TODO how to get the index of this host?
  const executor = new Executor(capacity, hostIndex);

  let executorId;
  try {
    executorId = await Executor.getExecutorId();
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
      await executor.runTasks();
      await sleep(1000);
    } catch (error) {
      console.error(error);
    }
  }
}

start();
