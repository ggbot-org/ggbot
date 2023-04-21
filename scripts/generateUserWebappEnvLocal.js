import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  $DEPLOY_STAGE,
  $NODE_ENV,
  $UTRUST_API_KEY,
  $UTRUST_WEBHOOK_SECRET,
} from "@ggbot2/env";

const content = `
DEPLOY_STAGE=${$DEPLOY_STAGE}
NODE_ENV=${$NODE_ENV}
UTRUST_API_KEY=${$UTRUST_API_KEY}
UTRUST_WEBHOOK_SECRET=${$UTRUST_WEBHOOK_SECRET}
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
