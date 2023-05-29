import { filename } from "@ggbot2/repo";
import { join } from "node:path";
import { build } from "esbuild";
import { publicDir } from "../package.js";

const bundleApp = async () => {
  build({
    bundle: true,
    minify: true,
    entryPoints: ["src/index.tsx"],
    outfile: join(publicDir, filename.appJs),
  });
};

bundleApp();
