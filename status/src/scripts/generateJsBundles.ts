import { join } from "node:path";

import { browserBundle } from "@ggbot2/esbuild";

import { publicDir } from "../package.js";
import { indexHtmlAppJs, indexHtmlEntryPoint } from "../pages/index.html.js";

const generateJsBundles = async () => {
  await browserBundle({
    entryPoints: [indexHtmlEntryPoint],
    outfile: join(publicDir, indexHtmlAppJs),
  });
};

generateJsBundles();
