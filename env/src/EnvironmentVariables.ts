import { EnvironmentVariableName } from "./environmentVariableNames.js";
import { ErrorMissingEnvironmentVariable } from "./errors.js";

export type DeployStage = "main" | "next" | "local";
export type NodeEnv = "development" | "production";

class EnvironmentVariables {
  private getVariable(VARIABLE_NAME: EnvironmentVariableName) {
    const VALUE = process.env[VARIABLE_NAME];
    if (typeof VALUE === "string") return VALUE;
    throw new ErrorMissingEnvironmentVariable(VARIABLE_NAME);
  }

  AWS_ACCOUNT_ID() {
    return this.getVariable("AWS_ACCOUNT_ID");
  }

  BINANCE_PROXY_BASE_URL() {
    return this.getVariable("BINANCE_PROXY_BASE_URL");
  }

  DEPLOY_STAGE(): DeployStage {
    const VARIABLE_NAME: EnvironmentVariableName = "DEPLOY_STAGE";
    const VALUE = process.env[VARIABLE_NAME];
    if (VALUE === "main") return "main";
    if (VALUE === "next") return "next";
    if (VALUE === "local") return "local";
    throw new ErrorMissingEnvironmentVariable(VARIABLE_NAME);
  }

  JWT_SECRET() {
    return this.getVariable("JWT_SECRET");
  }

  NODE_ENV(): NodeEnv {
    const VARIABLE_NAME: EnvironmentVariableName = "NODE_ENV";
    const VALUE = process.env[VARIABLE_NAME];
    if (VALUE === "production") return "production";
    return "development";
  }

  UTRUST_API_KEY() {
    return this.getVariable("UTRUST_API_KEY");
  }

  UTRUST_WEBHOOK_SECRET() {
    return this.getVariable("UTRUST_WEBHOOK_SECRET");
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
