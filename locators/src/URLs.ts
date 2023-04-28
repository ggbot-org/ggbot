import { pathname } from "./pathnames.js";
import { apiBaseURL, userWebappBaseURL } from "./baseURLs.js";

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
