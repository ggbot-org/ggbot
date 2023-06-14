import type { DeployStage } from "@ggbot2/env";

import {
  apiDomain,
  apiLocalDomain,
  apiNextDomain,
  userWebappDomain,
  userWebappNextDomain,
} from "./FQDNs.js";

export class ApiBaseURL extends URL {
  constructor(deployStage: DeployStage) {
    super(
      deployStage === "main"
        ? `https://${apiDomain}`
        : deployStage === "next"
        ? `https://${apiNextDomain}`
        : `https://${apiLocalDomain}`
    );
  }
}

export class UserWebappBaseURL extends URL {
  constructor(deployStage: DeployStage) {
    super(
      deployStage === "main"
        ? `https://${userWebappDomain}`
        : deployStage === "next"
        ? `https://${userWebappNextDomain}`
        : "http://127.0.0.1:8000/"
    );
  }
}
