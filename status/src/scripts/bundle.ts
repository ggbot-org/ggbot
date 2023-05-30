import { browserBundle } from "@ggbot2/esbuild";
import { filename } from "@ggbot2/repo";
import { join } from "node:path";
import { publicDir } from "../package.js";

const bundleApp = async () => {
  await browserBundle({
    entryPoints: ["src/index.tsx"],
    outfile: join(publicDir, filename.appJs),
  });
};

bundleApp();
