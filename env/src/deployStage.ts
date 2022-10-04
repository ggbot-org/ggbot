export type DeployStage = "main" | "next";

export const getDeployStage = (): DeployStage => {
  if (
    process.env.DEPLOY_STAGE === "main" ||
    process.env.NEXT_PUBLIC_DEPLOY_STAGE === "main"
  )
    return "main";
  return "next";
};

export const deployStageIsMain = getDeployStage() === "main";
