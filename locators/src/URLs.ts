import { pathname } from "./pathnames.js";

export class ApiPurchaseOrderURL extends URL {
  constructor(apiBaseURL: string) {
    super(pathname.utrustOrder(), apiBaseURL);
  }
}

export class UserWebappHomepageURL extends URL {
  constructor(userWebappBaseURL: string) {
    super(pathname.homePage(), userWebappBaseURL);
  }
}

export class UtrustCancelURL extends URL {
  constructor(userWebappBaseURL: string) {
    super(pathname.subscriptionCanceledPage(), userWebappBaseURL);
  }
}

export class UtrustCallbackURL extends URL {
  constructor(apiBaseURL: string) {
    super(pathname.utrustCallback(), apiBaseURL);
  }
}

export class UtrustReturnURL extends URL {
  constructor(userWebappBaseURL: string) {
    super(pathname.subscriptionPurchasedPage(), userWebappBaseURL);
  }
}
