import type { DayInterval } from "@ggbot2/time";
import { isLiteralType } from "@ggbot2/type-utils";

const subscriptionPlans = ["basic"];
export type SubscriptionPlan = typeof subscriptionPlans[number];
export const isSubscriptionPlan =
  isLiteralType<SubscriptionPlan>(subscriptionPlans);

export type Subscription = DayInterval & {
  plan: SubscriptionPlan;
};
