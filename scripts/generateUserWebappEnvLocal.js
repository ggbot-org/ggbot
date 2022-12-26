import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  getDeployStage,
  getNodeEnv,
  getUtrustApiKey,
  getUtrustWebhookSecret,
} from "@ggbot2/env";

const content = `
DEPLOY_STAGE=${getDeployStage()}
NODE_ENV=${getNodeEnv()}
UTRUST_API_KEY=${getUtrustApiKey()}
UTRUST_WEBHOOK_SECRET=${getUtrustWebhookSecret()}
`;

const envLocalFilepath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "user-webapp",
  ".env.local"
);

async function generateEnvLocal() {
  await writeFile(envLocalFilepath, content);
}

generateEnvLocal();
