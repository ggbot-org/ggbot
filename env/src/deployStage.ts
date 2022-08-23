export type DeployStage = "main" | "next";

const DEPLOY_STAGE = process.env.DEPLOY_STAGE;

export const getDeployStage = (): DeployStage => {
  switch (DEPLOY_STAGE) {
    case "main":
      return "main";
    default:
    case "next":
      return "next";
  }
};

export const deployStageIsMain = getDeployStage() === "main";
