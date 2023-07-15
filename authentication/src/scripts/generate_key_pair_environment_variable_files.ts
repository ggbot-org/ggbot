import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { EnvironmentVariableName } from "@ggbot2/env";

import { generateKeyPair } from "../generateKeyPair.js";
import { authenticationKeyEncodeBase64 } from "../keyPair.js";

const { privateKey } = await generateKeyPair();

const PRIVATE_KEY_ENVIRONMENT_VARIABLE_NAME: EnvironmentVariableName =
  "GGBOT2_AUTHENTICATION_PRIVATE_KEY";

const privateKeyEnvironmentPathname = join(
  dirname(fileURLToPath(import.meta.url)),
  `${PRIVATE_KEY_ENVIRONMENT_VARIABLE_NAME}.sh`
);

const privateKeyEnvironmentContent = `export ${PRIVATE_KEY_ENVIRONMENT_VARIABLE_NAME}="${authenticationKeyEncodeBase64(
  privateKey
)}"
`;

writeFile(privateKeyEnvironmentPathname, privateKeyEnvironmentContent, {
  encoding: "utf8",
}).then(() => {
  console.info(`Generated file ${privateKeyEnvironmentPathname}`);
});
