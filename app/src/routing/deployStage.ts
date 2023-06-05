import { DeployStage } from "@ggbot2/env";
import { UserWebappBaseURL } from "@ggbot2/locators";

const localOrigin = new UserWebappBaseURL("local").origin;
const nextOrigin = new UserWebappBaseURL("next").origin;
const mainOrigin = new UserWebappBaseURL("main").origin;

let deployStage: DeployStage | undefined;

/** Get `DeployStage` from `window.location.origin`. */
export const getDeployStage = () => {
  if (deployStage) return deployStage;

  const origin = window.location.origin;

  if (origin === localOrigin) deployStage = "local";
  if (origin === nextOrigin) deployStage = "next";
  if (origin === mainOrigin) deployStage = "main";

  return deployStage;
};
