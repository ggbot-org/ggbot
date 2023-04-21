import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: [`src/lambda.ts`],
  bundle: true,
  outfile: `temp/lambda/index.js`,
  tsconfig: "tsconfig.lambda.json",
});
