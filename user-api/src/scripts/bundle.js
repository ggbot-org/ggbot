import { awsLambdaBundle } from "@ggbot2/esbuild";

const bundleLambdas = async () => {
  await awsLambdaBundle({
    entryPoints: ["src/action.ts"],
    outfile: "temp/action/index.js",
  });
};

bundleLambdas();
