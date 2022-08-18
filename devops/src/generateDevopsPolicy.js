import { devopsPolicyStatements } from "@ggbot2/infrastructure";
import { isMainModule } from "./_isMainModule.js";

export const generateDevopsPolicy = () => {
  return {
    Version: "2012-10-17",
    Statement: devopsPolicyStatements(),
  };
};

if (isMainModule(import.meta.url)) {
  const devopsPolicy = generateDevopsPolicy();
  console.info(JSON.stringify(devopsPolicy, null, 2));
}
