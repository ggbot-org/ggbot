import {
  dateToDay,
  Day,
  DayInterval,
  dayToDate,
  getDate,
  isDay,
  isDayInterval,
  today,
} from "@ggbot2/time";
import {
  isLiteralType,
  isMaybeObject,
  NaturalNumber,
  objectTypeGuard,
} from "@ggbot2/type-utils";
import { DflowObject } from "dflow";

import { AccountKey } from "./account.js";
import { isItemId, Item, newId, NewItem } from "./item.js";
import { isPaymentProvider, PaymentProvider } from "./paymentProviders.js";
import { isSubscriptionPlan, SubscriptionPlan } from "./subscription.js";
import {
  createdNow,
  CreationTime,
  DayKey,
  isCreationTime,
  UpdateTime,
} from "./time.js";

export const subscriptionPurchaseStatuses = [
  "completed",
  "canceled",
  "pending",
] as const;
export type SubscriptionPurchaseStatus =
  (typeof subscriptionPurchaseStatuses)[number];
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
    paymentProvider,
    plan,
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
    paymentProvider,
    plan,
    status: "pending",
    ...createdNow(),
    ...dayInterval,
  };
};

export type ReadSubscriptionPurchase = (
  arg: SubscriptionPurchaseKey
) => Promise<SubscriptionPurchase | null>;

export type WriteSubscriptionPurchaseInput = SubscriptionPurchaseKey &
  SubscriptionPurchase;

export type WriteSubscriptionPurchase = (
  arg: WriteSubscriptionPurchaseInput
) => Promise<UpdateTime>;

export type CreateYearlySubscriptionPurchaseInput = AccountKey &
  NewYearlySubscriptionArg;

/** Create a yearly subscription. */
export type CreateYearlySubscriptionPurchase = (
  arg: CreateYearlySubscriptionPurchaseInput
) => Promise<SubscriptionPurchaseKey>;

export type CreateMonthlySubscriptionPurchaseInput = AccountKey &
  NewMonthlySubscriptionArg;

/** Create a monthly subscription. */
export type CreateMonthlySubscriptionPurchase = (
  arg: CreateMonthlySubscriptionPurchaseInput
) => Promise<SubscriptionPurchaseKey>;

export type UpdateSubscriptionPurchaseInfoInput = SubscriptionPurchaseKey &
  Pick<SubscriptionPurchase, "info">;

export type UpdateSubscriptionPurchaseInfo = (
  arg: UpdateSubscriptionPurchaseInfoInput
) => Promise<UpdateTime>;

export type UpdateSubscriptionPurchaseStatusInput = SubscriptionPurchaseKey &
  Pick<SubscriptionPurchase, "status">;

export type UpdateSubscriptionPurchaseStatus = (
  arg: UpdateSubscriptionPurchaseStatusInput
) => Promise<UpdateTime>;
