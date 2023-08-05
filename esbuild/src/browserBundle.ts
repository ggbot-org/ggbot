import { ENV } from "@ggbot2/env";
import { build, BuildOptions } from "esbuild";

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
  const { DEPLOY_STAGE } = ENV;

  build({
    alias: {
      "@formatjs/icu-messageformat-parser":
        "@formatjs/icu-messageformat-parser/no-parser",
    },
    bundle: true,
    minify: DEPLOY_STAGE !== "local",
    entryPoints,
    outfile,
    platform: "browser",
  });
};
