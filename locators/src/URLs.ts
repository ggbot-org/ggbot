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
  constructor(userWebappBaseURL: string) {
    super("/subscription/canceled", userWebappBaseURL);
  }
}

export class UtrustCallbackURL extends URL {
  constructor(apiBaseURL: string) {
    super("/utrust/callback", apiBaseURL);
  }
}

export class UtrustReturnURL extends URL {
  constructor(userWebappBaseURL: string) {
    super("/subscription/purchased", userWebappBaseURL);
  }
}
