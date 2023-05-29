const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const AWS_REGION = process.env.AWS_REGION;
const DEPLOY_STAGE = process.env.DEPLOY_STAGE;
const NODE_ENV = process.env.NODE_ENV;
const UTRUST_API_KEY = process.env.UTRUST_API_KEY;
const UTRUST_WEBHOOK_SECRET = process.env.UTRUST_WEBHOOK_SECRET;

export type DeployStage = "main" | "next" | "local";
export type NodeEnv = "development" | "production";

class EnvironmentVariables {
  get AWS_ACCOUNT_ID() {
    if (typeof AWS_ACCOUNT_ID === "string") return AWS_ACCOUNT_ID;
    // TODO once Next.js is removed
    return "";
    // throw new ErrorMissingEnvironmentVariable("AWS_ACCOUNT_ID");
  }

  get AWS_REGION() {
    if (typeof AWS_REGION === "string") return AWS_REGION;
    // TODO once Next.js is removed
    return "eu-central-1";
    // throw new ErrorMissingEnvironmentVariable("AWS_REGION");
  }

  get DEPLOY_STAGE() {
    if (DEPLOY_STAGE === "main") return "main";
    if (DEPLOY_STAGE === "next") return "next";
    if (DEPLOY_STAGE === "local") return "local";
    // TODO once Next.js is removed
    return "local";
    // throw new ErrorMissingEnvironmentVariable("DEPLOY_STAGE");
  }

  get deployStageIsLocal() {
    return this.DEPLOY_STAGE === "local";
  }

  get deployStageIsMain() {
    return this.DEPLOY_STAGE === "main";
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
