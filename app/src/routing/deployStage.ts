import { DeployStage } from "@ggbot2/env";
import { UserWebappBaseURL } from "@ggbot2/locators";

const localOrigin = new UserWebappBaseURL("local").origin;
const nextOrigin = new UserWebappBaseURL("next").origin;
const mainOrigin = new UserWebappBaseURL("main").origin;

let deployStage: DeployStage | undefined;

/** Get `DeployStage` from `window.location.origin`. */
export const getDeployStage = (): DeployStage => {
  if (deployStage) return deployStage;

  const origin = window.location.origin;

  switch (origin) {
    case mainOrigin:
      return "main";
    case nextOrigin:
      return "next";
    case localOrigin:
      return "local";
    default: {
      throw new Error(
        `Unable to guess DeployStage, local origin must be ${localOrigin}`
      );
    }
  }
};
