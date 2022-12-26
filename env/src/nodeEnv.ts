export type NodeEnv = "development" | "production";

export const getNodeEnv = (): NodeEnv => {
  if (process.env.NODE_ENV === "production") return "production";
  return "development";
};

export const nodeEnvIsProduction = getNodeEnv() === "production";
