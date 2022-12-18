import {
  CreateMonthlySubscriptionPurchase,
  CreateYearlySubscriptionPurchase,
  ReadSubscription,
  ReadSubscriptionHistory,
  newMonthlySubscription,
  AccountKey,
  SubscriptionPurchase,
  SubscriptionHistory,
  newYearlySubscription,
} from "@ggbot2/models";
import { getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readSubscription: ReadSubscription["func"] = async (accountKey) =>
  await getObject<ReadSubscription["out"]>({
    Key: pathname.subscription(accountKey),
  });

export const readSubscriptionHistory: ReadSubscriptionHistory["func"] = async (
  accountKey
) =>
  await getObject<ReadSubscriptionHistory["out"]>({
    Key: pathname.subscriptionHistory(accountKey),
  });

/** @internal */
const appendSubscriptionHistory = async ({
  accountId,
  ...purchase
}: AccountKey & SubscriptionPurchase): Promise<void> => {
  // Write `subscription`.
  const { plan, end } = purchase;
  const subscription = { plan, end };
  await putObject({
    Key: pathname.subscription({ accountId }),
    data: subscription,
  });
  // Append `purchase` to `subscriptionHistory`.
  const previousHistory = await readSubscriptionHistory({ accountId });
  const subscriptionHistory: SubscriptionHistory =
    previousHistory === null ? [purchase] : previousHistory.concat(purchase);
  await putObject({
    Key: pathname.subscriptionHistory({ accountId }),
    data: subscriptionHistory,
  });
};

export const createMonthlySubscriptionPurchase: CreateMonthlySubscriptionPurchase["func"] =
  async ({ accountId, ...arg }) => {
    const purchase = newMonthlySubscription(arg);
    await appendSubscriptionHistory({ accountId, ...purchase });
    return purchase;
  };

export const createYearlySubscriptionPurchase: CreateYearlySubscriptionPurchase["func"] =
  async ({ accountId, ...arg }) => {
    const purchase = newYearlySubscription(arg);
    await appendSubscriptionHistory({ accountId, ...purchase });
    return purchase;
  };
