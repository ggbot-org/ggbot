import type { DayInterval } from "@ggbot2/time";
import { isLiteralType } from "./literalType.js";

const subscriptionPlans = ["basic"];
export type SubscriptionPlan = typeof subscriptionPlans[number];
export const isSubscriptionPlan =
  isLiteralType<SubscriptionPlan>(subscriptionPlans);

export type Subscription = DayInterval & {
  plan: SubscriptionPlan;
};
