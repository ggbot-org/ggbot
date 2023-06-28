export class ApiAuthenticationEnterURL extends URL {
  constructor(apiBaseURL: string) {
    super("/auth/enter", apiBaseURL);
  }
}

export class ApiAuthenticationExitURL extends URL {
  constructor(apiBaseURL: string) {
    super("/auth/exit", apiBaseURL);
  }
}

export class ApiAuthenticationVerifyURL extends URL {
  constructor(apiBaseURL: string) {
    super("/auth/verify", apiBaseURL);
  }
}

export class ApiAdminActionURL extends URL {
  constructor(apiBaseURL: string) {
    super("/admin/action", apiBaseURL);
  }
}

export class ApiPublicActionURL extends URL {
  constructor(apiBaseURL: string) {
    super("/public/action", apiBaseURL);
  }
}

export class ApiUserActionURL extends URL {
  constructor(apiBaseURL: string) {
    super("/user/action", apiBaseURL);
  }
}

export class ApiPurchaseOrderURL extends URL {
  constructor(apiBaseURL: string) {
    super("/utrust/order", apiBaseURL);
  }
}

export class UserWebappHomepageURL extends URL {
  constructor(userWebappBaseURL: string) {
    super("/", userWebappBaseURL);
  }
}

export class UtrustCancelURL extends URL {
  static htmlFileName = "subscription-canceled.html";
  constructor(userWebappBaseURL: string) {
    super(`/${UtrustCancelURL.htmlFileName}`, userWebappBaseURL);
  }
}

export class UtrustCallbackURL extends URL {
  constructor(apiBaseURL: string) {
    super("/utrust/callback", apiBaseURL);
  }
}

export class UtrustReturnURL extends URL {
  static htmlFileName = "subscription-purchased.html";
  constructor(userWebappBaseURL: string) {
    super(`/${UtrustReturnURL.htmlFileName}`, userWebappBaseURL);
  }
}
