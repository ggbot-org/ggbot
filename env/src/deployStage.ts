import { ErrorInvalidEnvironmentVariable } from "./errors.js";

export type DeployStage = "main" | "next";

const DEPLOY_STAGE = process.env.DEPLOY_STAGE;

export const getDeployStage = (): DeployStage => {
  switch (DEPLOY_STAGE) {
    case "main":
      return "main";
    case undefined:
    case "next":
      return "next";
    default:
      throw new ErrorInvalidEnvironmentVariable({
        name: "DEPLOY_STAGE",
        value: DEPLOY_STAGE,
      });
  }
};

export const deployStageIsMain = getDeployStage() === "main";
