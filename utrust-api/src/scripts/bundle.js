import { awsLambdaBundle } from "@ggbot2/esbuild";

const bundleLambdas = async () => {
  await awsLambdaBundle({
    entryPoints: ["src/callback.ts"],
    outfile: "temp/callback/index.js",
  });

  await awsLambdaBundle({
    entryPoints: ["src/order.tsx"],
    outfile: "temp/order/index.js",
  });
};

bundleLambdas();
