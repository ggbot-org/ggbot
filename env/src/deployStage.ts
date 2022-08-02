export type DeployStage = "main" | "next";

const GGBOT2_DEPLOY_STAGE = process.env.GGBOT2_DEPLOY_STAGE;

export const getDeployStage = (): DeployStage => {
  switch (GGBOT2_DEPLOY_STAGE) {
    case "main":
      return "main";
    default:
      return "next";
  }
};

export const deployStageIsMain = getDeployStage() === "main";
