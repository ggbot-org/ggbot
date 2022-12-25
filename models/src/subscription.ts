import {
  Day,
  DayInterval,
  isDayInterval,
  getDate,
  today,
  isDay,
  dayToDate,
  dateToDay,
} from "@ggbot2/time";
import {
  isLiteralType,
  NaturalNumber,
  objectTypeGuard,
} from "@ggbot2/type-utils";
import type { AccountKey } from "./account";
import { Item, NewItem, isItemId, newId } from "./item.js";
import type { Operation } from "./operation.js";
import { CreationTime, createdNow, isCreationTime } from "./time.js";

export const monthlyPrice = 10; // EUR
export const monthlyPriceCurrency = "EUR";
export const purchaseMaxNumMonths = 12;
export const totalPurchase = (numMonths: NaturalNumber) => {
  // if 12 months apply discount.
  if (numMonths === 12) return monthlyPrice * 11;
  return numMonths * monthlyPrice;
};

const paymentProviders = ["utrust"];
export type PaymentProvider = typeof paymentProviders[number];
export const isPaymentProvider =
  isLiteralType<PaymentProvider>(paymentProviders);

const subscriptionPlans = ["basic"];
export type SubscriptionPlan = typeof subscriptionPlans[number];
export const isSubscriptionPlan =
  isLiteralType<SubscriptionPlan>(subscriptionPlans);

const subscriptionStatuses = ["active", "expired"];
export type SubscriptionStatus = typeof subscriptionStatuses[number];
export const isSubscriptionStatus =
  isLiteralType<SubscriptionStatus>(subscriptionStatuses);

export type Subscription = Pick<DayInterval, "end"> & {
  plan: SubscriptionPlan;
};

export const isSubscription = objectTypeGuard<Subscription>(
  ({ plan, end }) => isSubscriptionPlan(plan) && isDay(end)
);

export const subscriptionStatus = ({
  end,
}: Pick<Subscription, "end">): SubscriptionStatus =>
  end > today() ? "active" : "expired";

export type SubscriptionPurchase = Item &
  CreationTime &
  DayInterval & {
    plan: SubscriptionPlan;
    paymentProvider: PaymentProvider;
  };

export type SubscriptionHistory = SubscriptionPurchase[];

export const isSubscriptionPurchase = objectTypeGuard<SubscriptionPurchase>(
  ({ id, plan, paymentProvider, whenCreated, ...dayInterval }) =>
    isItemId(id) &&
    isSubscriptionPlan(plan) &&
    isPaymentProvider(paymentProvider) &&
    isCreationTime({ whenCreated }) &&
    isDayInterval(dayInterval)
);

type NewMonthlySubscriptionArg = Pick<
  NewItem<SubscriptionPurchase>,
  "plan" | "paymentProvider"
> & {
  startDay: Day;
  numMonths: NaturalNumber;
};

export const newMonthlySubscription = ({
  plan,
  paymentProvider,
  startDay,
  numMonths,
}: NewMonthlySubscriptionArg): SubscriptionPurchase => {
  const startDate = dayToDate(startDay);
  const endDate = getDate(startDate).plus(numMonths).months();
  const endDay = dateToDay(endDate);
  const dayInterval = { start: startDay, end: endDay };

  return {
    id: newId(),
    plan,
    paymentProvider,
    ...createdNow(),
    ...dayInterval,
  };
};

type NewYearlySubscriptionArg = Pick<
  NewItem<SubscriptionPurchase>,
  "plan" | "paymentProvider"
> & { startDay: Day };

export const newYearlySubscription = ({
  plan,
  paymentProvider,
  startDay,
}: NewYearlySubscriptionArg): SubscriptionPurchase => {
  const startDate = dayToDate(startDay);
  const endDate = getDate(startDate).plus(1).years();
  const endDay = dateToDay(endDate);
  const dayInterval = { start: startDay, end: endDay };

  return {
    id: newId(),
    plan,
    paymentProvider,
    ...createdNow(),
    ...dayInterval,
  };
};

export type ReadSubscription = Operation<AccountKey, Subscription | null>;

/**
 * Create a yearly subscription, update Subscription and append it in SubscriptionHistory.
 */
export type CreateYearlySubscriptionPurchase = Operation<
  AccountKey & NewYearlySubscriptionArg,
  SubscriptionPurchase
>;

/**
 * Create a monthly subscription, update Subscription and append it in SubscriptionHistory.
 */
export type CreateMonthlySubscriptionPurchase = Operation<
  AccountKey & NewMonthlySubscriptionArg,
  SubscriptionPurchase
>;

export type ReadSubscriptionHistory = Operation<
  AccountKey,
  SubscriptionHistory | null
>;
