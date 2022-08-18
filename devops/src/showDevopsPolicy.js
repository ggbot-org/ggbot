import { getDevopsPolicy } from "@ggbot2/infrastructure";
import { isMainModule } from "./_isMainModule.js";

if (isMainModule(import.meta.url)) {
  const devopsPolicy = getDevopsPolicy();
  console.info(JSON.stringify(devopsPolicy, null, 2));
}
