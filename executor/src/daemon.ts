import { exit, pid } from "node:process";
import { fileURLToPath } from "node:url";
import { getExecutorId } from "./executorId.js";
import { executorTasks } from "./tasks.js";

export async function spawnExecutorDaemon() {
  let executorId;
  try {
    executorId = await getExecutorId();
  } catch (error) {
    console.error(error);
    exit(1);
  }

  console.info("executor daemon pid", pid);
  console.info("executor daemon executorId", executorId);

  let canRun = true;

  const terminate = () => {
    console.info("executor daemon", pid, "is terminating");
    canRun = false;
  };

  process.on("SIGHUP", () => {
    console.info("executor daemon", pid, "SIGHUP");
  });

  process.on("SIGINT", terminate);

  process.on("SIGTERM", terminate);

  // While loop must be last statement.
  while (canRun) {
    try {
      await executorTasks();
    } catch (error) {
      console.error(error);
    }
  }
}

function isMainModule() {
  if (import.meta.url.startsWith("file:")) {
    const modulePath = fileURLToPath(import.meta.url);
    return process.argv[1] === modulePath)
  }
  return false;
}

if (isMainModule()) await spawnExecutorDaemon();
