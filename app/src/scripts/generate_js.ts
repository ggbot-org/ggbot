import { join } from "node:path";

import { browserBundle } from "@ggbot2/esbuild";

import {
  appEntryPoint,
  appJs,
  publicDir,
  tryFlowEntryPoint,
  tryFlowJs,
} from "../package.js";

const generateJsBundles = async () => {
  await browserBundle({
    entryPoints: [appEntryPoint],
    outfile: join(publicDir, appJs),
  });

  await browserBundle({
    entryPoints: [tryFlowEntryPoint],
    outfile: join(publicDir, tryFlowJs),
  });
};

generateJsBundles();
