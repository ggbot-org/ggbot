export type NodeEnv = "development" | "production";

const NODE_ENV = process.env.NODE_ENV;

export const getNodeEnv = (): NodeEnv => {
  switch (NODE_ENV) {
    case "production":
      return "production";
    default:
      return "development";
  }
};

export const nodeEnvIsProduction = getNodeEnv() === "production";
