import { build, BuildOptions } from "esbuild";

/**
 * Generate bundle for AWS lambda functions.
 *
 * @example
 *
 * ```ts
 * import { awsLambdaBundle } from "@ggbot2/esbuild";
 *
 * const bundleLambdas = async () => {
 *   await awsLambdaBundle({
 *     entryPoints: ["src/lambda.ts"],
 *     outfile: "temp/lambda/index.js",
 *   });
 * };
 *
 * bundleLambdas();
 * ```
 */
export const awsLambdaBundle = async ({
  entryPoints,
  outfile,
}: Pick<BuildOptions, "entryPoints" | "outfile">) => {
  build({
    bundle: true,
    entryPoints,
    define: {
      window: "globalThis",
    },
    outfile,
    platform: "node",
    target: "esnext",
  });
};
