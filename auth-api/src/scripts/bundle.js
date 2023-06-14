import { awsLambdaBundle } from "@ggbot2/esbuild";

const bundleLambdas = async () => {
  await awsLambdaBundle({
    entryPoints: ["src/enter.ts"],
    outfile: "temp/enter/index.js",
  });

  await awsLambdaBundle({
    entryPoints: ["src/exit.tsx"],
    outfile: "temp/exit/index.js",
  });

  await awsLambdaBundle({
    entryPoints: ["src/verify.tsx"],
    outfile: "temp/verify/index.js",
  });
};

bundleLambdas();
