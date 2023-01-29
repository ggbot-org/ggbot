import { SubscriptionPlan } from "./subscription.js";

export const quotaTypes = [
  "NUM_DAYS_TRANSACTIONS_HISTORY",
  "MAX_ORDERS_IN_ORDERS_POOL",
  "MAX_STRATEGIES_PER_ACCOUNT",
  "MAX_SCHEDULINGS_PER_ACCOUNT",
] as const;
export type QuotaType = typeof quotaTypes[number];

export const quota: Record<
  QuotaType,
  (arg: SubscriptionPlan | null) => number
> = {
  NUM_DAYS_TRANSACTIONS_HISTORY: (plan) => {
    if (!plan) return 30;
    return 365;
  },
  MAX_ORDERS_IN_ORDERS_POOL: (plan) => {
    if (!plan) return 0;
    return 10;
  },
  MAX_STRATEGIES_PER_ACCOUNT: (plan) => {
    if (!plan) return 2;
    return 20;
  },
  MAX_SCHEDULINGS_PER_ACCOUNT: (plan) => {
    if (!plan) return 0;
    return 10;
  },
};
