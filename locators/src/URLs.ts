import { ENV } from "@ggbot2/env";
import { pathname } from "./pathnames.js";
import { ApiBaseURL, UserWebappBaseURL } from "./baseURLs.js";

const { DEPLOY_STAGE } = ENV;

const apiBaseURL = new ApiBaseURL(DEPLOY_STAGE).toString();
const userWebappBaseURL = new UserWebappBaseURL(DEPLOY_STAGE).toString();

export class ApiPurchaseOrderURL extends URL {
  constructor() {
    super(pathname.utrustOrder(), apiBaseURL);
  }
}

export class UserWebappHomepageURL extends URL {
  constructor() {
    super(pathname.homePage(), userWebappBaseURL);
  }
}

export class UtrustCancelURL extends URL {
  constructor() {
    super(pathname.subscriptionCanceledPage(), userWebappBaseURL);
  }
}

export class UtrustCallbackURL extends URL {
  constructor() {
    super(pathname.utrustCallback(), apiBaseURL);
  }
}

export class UtrustReturnURL extends URL {
  constructor() {
    super(pathname.subscriptionPurchasedPage(), userWebappBaseURL);
  }
}
