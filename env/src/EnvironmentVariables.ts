import { ErrorMissingEnvironmentVariable } from "./errors.js";

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const DEPLOY_STAGE = process.env.DEPLOY_STAGE;
const NODE_ENV = process.env.NODE_ENV;
const GGBOT2_AUTHENTICATION_PRIVATE_KEY =
  process.env.GGBOT2_AUTHENTICATION_PRIVATE_KEY;
const UTRUST_API_KEY = process.env.UTRUST_API_KEY;
const UTRUST_WEBHOOK_SECRET = process.env.UTRUST_WEBHOOK_SECRET;

export type DeployStage = "main" | "next" | "local";
export type NodeEnv = "development" | "production";

class EnvironmentVariables {
  get AWS_ACCOUNT_ID() {
    if (typeof AWS_ACCOUNT_ID === "string") return AWS_ACCOUNT_ID;
    throw new ErrorMissingEnvironmentVariable("AWS_ACCOUNT_ID");
  }

  get DEPLOY_STAGE() {
    if (DEPLOY_STAGE === "main") return "main";
    if (DEPLOY_STAGE === "next") return "next";
    if (DEPLOY_STAGE === "local") return "local";
    throw new ErrorMissingEnvironmentVariable("DEPLOY_STAGE");
  }

  get GGBOT2_AUTHENTICATION_PRIVATE_KEY() {
    if (typeof GGBOT2_AUTHENTICATION_PRIVATE_KEY === "string")
      return GGBOT2_AUTHENTICATION_PRIVATE_KEY;
    throw new ErrorMissingEnvironmentVariable(
      "GGBOT2_AUTHENTICATION_PRIVATE_KEY"
    );
  }

  get NODE_ENV(): NodeEnv {
    if (NODE_ENV === "production") return "production";
    return "development";
  }

  get UTRUST_API_KEY() {
    if (typeof UTRUST_API_KEY === "string") return UTRUST_API_KEY;
    return "";
  }

  get UTRUST_WEBHOOK_SECRET() {
    if (typeof UTRUST_WEBHOOK_SECRET === "string") return UTRUST_WEBHOOK_SECRET;
    return "";
  }

  get deployStageIsNotLocal() {
    return this.DEPLOY_STAGE !== "local";
  }

  get deployStageIsMain() {
    return this.DEPLOY_STAGE === "main";
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
 * const { AWS_ACCOUNT_ID, DEPLOY_STAGE } = ENV;
 * ```
 */
export const ENV = new EnvironmentVariables();
