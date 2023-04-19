const UTRUST_API_KEY = process.env.UTRUST_API_KEY;

export const utrustEnvironments = ["sandbox", "production"] as const;
export type UtrustEnvironment = typeof utrustEnvironments[number];

export const getUtrustEnvironment = (): UtrustEnvironment => 
  // TODO return deployStageIsMain ? "production" : "sandbox"
   "sandbox"
;

export const getUtrustApiKey = (): string => {
  if (typeof UTRUST_API_KEY === "string") return UTRUST_API_KEY;
  return "";
};

const UTRUST_WEBHOOK_SECRET = process.env.UTRUST_WEBHOOK_SECRET;

export const getUtrustWebhookSecret = (): string => {
  if (typeof UTRUST_WEBHOOK_SECRET === "string") return UTRUST_WEBHOOK_SECRET;
  return "";
};
