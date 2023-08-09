import { ErrorMissingEnvironmentVariable } from "./errors.js";

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const BINANCE_PROXY_BASE_URL = process.env.BINANCE_PROXY_BASE_URL;
const DEPLOY_STAGE = process.env.DEPLOY_STAGE;
const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET = process.env.JWT_SECRET;
const UTRUST_API_KEY = process.env.UTRUST_API_KEY;
const UTRUST_WEBHOOK_SECRET = process.env.UTRUST_WEBHOOK_SECRET;

export type DeployStage = "main" | "next" | "local";
export type NodeEnv = "development" | "production";

class EnvironmentVariables {
  AWS_ACCOUNT_ID() {
    if (typeof AWS_ACCOUNT_ID === "string") return AWS_ACCOUNT_ID;
    throw new ErrorMissingEnvironmentVariable("AWS_ACCOUNT_ID");
  }

  BINANCE_PROXY_BASE_URL() {
    if (typeof BINANCE_PROXY_BASE_URL === "string")
      return BINANCE_PROXY_BASE_URL;
    throw new ErrorMissingEnvironmentVariable("BINANCE_PROXY_BASE_URL");
  }

  DEPLOY_STAGE() {
    if (DEPLOY_STAGE === "main") return "main";
    if (DEPLOY_STAGE === "next") return "next";
    if (DEPLOY_STAGE === "local") return "local";
    throw new ErrorMissingEnvironmentVariable("DEPLOY_STAGE");
  }

  JWT_SECRET() {
    if (typeof JWT_SECRET === "string") return JWT_SECRET;
    throw new ErrorMissingEnvironmentVariable("JWT_SECRET");
  }

  NODE_ENV(): NodeEnv {
    if (NODE_ENV === "production") return "production";
    return "development";
  }

  UTRUST_API_KEY() {
    if (typeof UTRUST_API_KEY === "string") return UTRUST_API_KEY;
    return "";
  }

  UTRUST_WEBHOOK_SECRET() {
    if (typeof UTRUST_WEBHOOK_SECRET === "string") return UTRUST_WEBHOOK_SECRET;
    return "";
  }
}

/**
 * Environment variables.
 *
 * @example
 *
 * ```ts
 * import { ENV } from "@ggbot2/env";
 *
 * console.info("DeployStage", ENV.DEPLOY_STAGE());
 * ```
 */
export const ENV = new EnvironmentVariables();
