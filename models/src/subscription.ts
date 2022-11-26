import type { DayInterval } from "@ggbot2/time";

const subscriptionPlans = ["basic"];
export type SubscriptionPlan = typeof subscriptionPlans[number];

export type Subscription = DayInterval & {
  plan: SubscriptionPlan;
};
