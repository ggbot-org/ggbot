import * as esbuild from "esbuild";

const build = async (target) => {
  await esbuild.build({
    entryPoints: [`src/${target}.ts`],
    bundle: true,
    outfile: `temp/${target}/index.js`,
    platform: "node",
  });
};

await build("callback");
await build("order");
