import { DayInterval, isDay, today } from "@ggbot2/time";
import {
  isLiteralType,
  NaturalNumber,
  objectTypeGuard,
} from "@ggbot2/type-utils";

import { AccountKey } from "./account.js";
import { Currency } from "./currency.js";
import { Operation } from "./operation.js";
import { UpdateTime } from "./time.js";

export const monthlyPrice = 10;

export const purchaseCurrency: Currency = "EUR";
export const purchaseDefaultNumMonths = 6;
export const purchaseMaxNumMonths = 12;
export const purchaseMinNumMonths = 1;

export const totalPurchase = (numMonths: NaturalNumber) => {
  // if 12 months, apply discount.
  if (numMonths === 12) return monthlyPrice * 11;
  return numMonths * monthlyPrice;
};

const subscriptionPlans = ["basic"] as const;
export type SubscriptionPlan = (typeof subscriptionPlans)[number];
export const isSubscriptionPlan =
  isLiteralType<SubscriptionPlan>(subscriptionPlans);

export const subscriptionStatuses = ["active", "expired"] as const;
export type SubscriptionStatus = (typeof subscriptionStatuses)[number];
export const isSubscriptionStatus =
  isLiteralType<SubscriptionStatus>(subscriptionStatuses);

export type Subscription = Pick<DayInterval, "end"> & {
  plan: SubscriptionPlan;
};

export const isSubscription = objectTypeGuard<Subscription>(
  ({ plan, end }) => isSubscriptionPlan(plan) && isDay(end)
);

export const statusOfSubscription = ({
  end,
}: Pick<Subscription, "end">): SubscriptionStatus =>
  end > today() ? "active" : "expired";

export type ReadSubscription = Operation<AccountKey, Subscription | null>;

export type WriteSubscription = Operation<
  AccountKey & Subscription,
  UpdateTime
>;

export type ReadSubscriptionPlan = Operation<
  AccountKey,
  SubscriptionPlan | null
>;
