import { DeployStage } from "@ggbot2/env";
import { apiDomain, userWebappDomain, userWebappNextDomain } from "./FQDNs.js";

export class ApiBaseURL extends URL {
  static local = `https://${apiDomain}/local`;
  static main = `https://${apiDomain}`;
  static next = `https://${apiDomain}/next`;

  constructor(deployStage: DeployStage) {
    super(
      deployStage === "main"
        ? ApiBaseURL.main
        : deployStage === "next"
        ? ApiBaseURL.next
        : ApiBaseURL.local
    );
  }
}

export class UserWebappBaseURL extends URL {
  static local = "http://localhost:3000";
  static main = `https://${userWebappDomain}`;
  static next = `https://${userWebappNextDomain}`;

  constructor(deployStage: DeployStage) {
    super(
      deployStage === "main"
        ? UserWebappBaseURL.main
        : deployStage === "next"
        ? UserWebappBaseURL.next
        : UserWebappBaseURL.local
    );
  }
}
