import { build, BuildOptions } from "esbuild";
import {ENV} from '@ggbot2/env'

/**
 * Generate bundle for web apps.
 *
 * @example
 *
 * ```ts
 * import { browserBundle } from "@ggbot2/esbuild";
 *
 * const bundleWebApps = async () => {
 *   await browserBundle({
 *     entryPoints: ["src/app.tsx"],
 *     outfile: "public/app.js",
 *   });
 * };
 *
 * bundleWebApps();
 * ```
 */
export const browserBundle = async ({
  entryPoints,
  outfile,
}: Pick<BuildOptions, "entryPoints" | "outfile">) => {
  const {DEPLOY_STAGE} = ENV

  build({
    bundle: true,
    minify: DEPLOY_STAGE!=='local',
    entryPoints,
    outfile,
    platform: "browser",
  });
};
