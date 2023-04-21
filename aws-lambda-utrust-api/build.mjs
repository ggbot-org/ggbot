import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/order.ts"],
  bundle: true,
  outfile: "temp/order.js",
});
