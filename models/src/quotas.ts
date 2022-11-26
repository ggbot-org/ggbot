// TODO apply quotas, raise ErrorQuotaExceeded
import type { SubscriptionPlan } from "./subscription.js";

export const quotaTypes = [
  "NUM_DAYS_TRANSACTIONS_HISTORY",
  "MAX_ORDERS_IN_ORDERS_POOL",
  "MAX_STRATEGIES_PER_ACCOUNT",
  "MAX_SCHEDULINGS_PER_ACCOUNT",
] as const;
export type QuotaType = typeof quotaTypes[number];
type Quota = (arg?: SubscriptionPlan) => number;

export const quota: Record<QuotaType, Quota> = {
  NUM_DAYS_TRANSACTIONS_HISTORY: () => 365,
  MAX_ORDERS_IN_ORDERS_POOL: () => 5,
  MAX_STRATEGIES_PER_ACCOUNT: (plan) => {
    if (!plan) return 2;
    return 10;
  },
  MAX_SCHEDULINGS_PER_ACCOUNT: (plan) => {
    if (!plan) return 0;
    return 5;
  },
};
