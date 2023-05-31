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
