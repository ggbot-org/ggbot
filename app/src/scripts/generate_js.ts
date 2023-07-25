import { join } from "node:path";

import { browserBundle } from "@ggbot2/esbuild";

import {
  appEntryPoint,
  appJs,
  flowEntryPoint,
  flowJs,
  publicDir,
} from "../package.js";

const generateJsBundles = async () => {
  await browserBundle({
    entryPoints: [appEntryPoint],
    outfile: join(publicDir, appJs),
  });

  await browserBundle({
    entryPoints: [flowEntryPoint],
    outfile: join(publicDir, flowJs),
  });
};

generateJsBundles();
