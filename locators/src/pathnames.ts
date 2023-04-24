export const pathname = {
  homePage: () => "/",
  // TODO should be /privacy.html
  privacyPolicyPage: () => "/privacy",
  subscriptionCanceledPage: () => "/subscription/canceled",
  subscriptionPurchasedPage: () => "/subscription/purchased",
  // TODO should be /terms.html
  termsOfServicePage: () => "/terms",
  utrustCallback: () => "/utrust/callback",
  utrustOrder: () => "/utrust/order",
} as const;
