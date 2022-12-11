import { spawnExecutorDaemon } from "./daemon.js";

async function startExecutor() {
  await spawnExecutorDaemon();
}

startExecutor();
