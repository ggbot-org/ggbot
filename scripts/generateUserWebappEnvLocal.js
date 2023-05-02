// TODO remove this once Next.js is removed
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ENV } from "@ggbot2/env";

const {
  AWS_REGION,
  DEPLOY_STAGE,
  NODE_ENV,
  UTRUST_API_KEY,
  UTRUST_WEBHOOK_SECRET,
} = ENV;

const content = `
AWS_REGION=${AWS_REGION}
DEPLOY_STAGE=${DEPLOY_STAGE}
NODE_ENV=${NODE_ENV}
UTRUST_API_KEY=${UTRUST_API_KEY}
UTRUST_WEBHOOK_SECRET=${UTRUST_WEBHOOK_SECRET}
`;

const envLocalFilepath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "app",
  ".env.local"
);

async function generateEnvLocal() {
  await writeFile(envLocalFilepath, content);
}

generateEnvLocal();
