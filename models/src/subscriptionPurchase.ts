import {
  Day,
  DayInterval,
  dateToDay,
  dayToDate,
  getDate,
  isDay,
  isDayInterval,
  today,
} from "@ggbot2/time";
import {
  NaturalNumber,
  isLiteralType,
  isMaybeObject,
  objectTypeGuard,
} from "@ggbot2/type-utils";
import type { DflowObject } from "dflow";
import type { AccountKey } from "./account.js";
import { Item, NewItem, isItemId, newId } from "./item.js";
import type { Operation } from "./operation.js";
import { PaymentProvider, isPaymentProvider } from "./paymentProviders.js";
import { SubscriptionPlan, isSubscriptionPlan } from "./subscription.js";
import {
  DayKey,
  CreationTime,
  UpdateTime,
  createdNow,
  isCreationTime,
} from "./time.js";

export const subscriptionPurchaseStatuses = [
  "completed",
  "canceled",
  "pending",
] as const;
export type SubscriptionPurchaseStatus =
  typeof subscriptionPurchaseStatuses[number];
export const isSubscriptionPurchaseStatus =
  isLiteralType<SubscriptionPurchaseStatus>(subscriptionPurchaseStatuses);

export type SubscriptionPurchase = Item &
  CreationTime &
  DayInterval & {
    info?: DflowObject;
    plan: SubscriptionPlan;
    paymentProvider: PaymentProvider;
    status: SubscriptionPurchaseStatus;
  };

export const isSubscriptionPurchase = objectTypeGuard<SubscriptionPurchase>(
  ({ id, plan, paymentProvider, status, whenCreated, info, ...dayInterval }) =>
    isItemId(id) &&
    isSubscriptionPlan(plan) &&
    isPaymentProvider(paymentProvider) &&
    isCreationTime({ whenCreated }) &&
    isDayInterval(dayInterval) &&
    isSubscriptionPurchaseStatus(status) &&
    info === undefined
      ? true
      : isMaybeObject(info)
);

export type SubscriptionPurchaseKey = AccountKey &
  DayKey & {
    purchaseId: SubscriptionPurchase["id"];
  };

export const isSubscriptionPurchaseKey =
  objectTypeGuard<SubscriptionPurchaseKey>(
    ({ day, accountId, purchaseId }) =>
      isItemId(accountId) && isDay(day) && isItemId(purchaseId)
  );

export const newSubscriptionPurchaseKey = ({
  accountId,
  purchaseId,
}: Omit<SubscriptionPurchaseKey, "day">): SubscriptionPurchaseKey => ({
  accountId,
  purchaseId,
  day: today(),
});

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
    status: "pending",
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
    status: "pending",
    ...createdNow(),
    ...dayInterval,
  };
};

export type ReadSubscriptionPurchase = Operation<
  SubscriptionPurchaseKey,
  SubscriptionPurchase | null
>;

export type WriteSubscriptionPurchase = Operation<
  SubscriptionPurchaseKey & SubscriptionPurchase,
  UpdateTime
>;

/**
 * Create a yearly subscription.
 */
export type CreateYearlySubscriptionPurchase = Operation<
  AccountKey & NewYearlySubscriptionArg,
  SubscriptionPurchaseKey
>;

/**
 * Create a monthly subscription.
 */
export type CreateMonthlySubscriptionPurchase = Operation<
  AccountKey & NewMonthlySubscriptionArg,
  SubscriptionPurchaseKey
>;

export type UpdateSubscriptionPurchaseInfo = Operation<
  SubscriptionPurchaseKey & Pick<SubscriptionPurchase, "info">,
  UpdateTime
>;

export type UpdateSubscriptionPurchaseStatus = Operation<
  SubscriptionPurchaseKey & Pick<SubscriptionPurchase, "status">,
  UpdateTime
>;
