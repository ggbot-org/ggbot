import { ErrorInvalidEnvironmentVariable } from "./errors.js";

export type DeployStage = "main" | "next";

const GGBOT2_DEPLOY_STAGE = process.env.GGBOT2_DEPLOY_STAGE;

export const getDeployStage = (): DeployStage => {
  switch (GGBOT2_DEPLOY_STAGE) {
    case "main":
      return "main";
    case undefined:
    case "next":
      return "next";
    default:
      throw new ErrorInvalidEnvironmentVariable({
        name: "GGBOT2_DEPLOY_STAGE",
        value: GGBOT2_DEPLOY_STAGE,
      });
  }
};

export const deployStageIsMain = getDeployStage() === "main";
