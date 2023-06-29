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
  build({
    bundle: true,
    minify: true,
    entryPoints,
    outfile,
    platform: "browser",
  });
};
