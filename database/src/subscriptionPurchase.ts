import {
  AccountKey,
  CreateMonthlySubscriptionPurchase,
  CreateYearlySubscriptionPurchase,
  ReadSubscriptionPurchase,
  SubscriptionPurchase,
  SubscriptionPurchaseKey,
  WriteSubscriptionPurchase,
  UpdateSubscriptionPurchase,
  newMonthlySubscription,
  newSubscriptionPurchaseKey,
  newYearlySubscription,
  updatedNow,
} from "@ggbot2/models";
import { getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";
import { ErrorAccountItemNotFound } from "./errors.js";

export const readSubscriptionPurchase: ReadSubscriptionPurchase["func"] =
  async (arg) =>
    await getObject<ReadSubscriptionPurchase["out"]>({
      Key: pathname.subscriptionPurchase(arg),
    });

export const writeSubscriptionPurchase: WriteSubscriptionPurchase["func"] =
  async ({ accountId, purchaseId, day, ...purchase }) => {
    const Key = pathname.subscriptionPurchase({ accountId, purchaseId, day });
    await putObject({
      Key,
      data: purchase,
    });
    return updatedNow();
  };

export const updateSubscriptionPurchase: UpdateSubscriptionPurchase["func"] =
  async ({ info, status, ...key }) => {
    const purchase = await readSubscriptionPurchase(key);
    if (!purchase)
      throw new ErrorAccountItemNotFound({
        accountId: key.accountId,
        type: "SubscriptionPurchase",
      });
    return await writeSubscriptionPurchase({
      ...purchase,
      ...key,
      info,
      status,
    });
  };

const writeNewSubscriptionPurchase = async ({
  accountId,
  purchase,
}: AccountKey & {
  purchase: SubscriptionPurchase;
}): Promise<SubscriptionPurchaseKey> => {
  const key = newSubscriptionPurchaseKey({
    accountId,
    purchaseId: purchase.id,
  });
  await writeSubscriptionPurchase({ ...purchase, ...key });
  return key;
};

export const createMonthlySubscriptionPurchase: CreateMonthlySubscriptionPurchase["func"] =
  async ({ accountId, ...arg }) => {
    const purchase = newMonthlySubscription(arg);
    return await writeNewSubscriptionPurchase({ accountId, purchase });
  };

export const createYearlySubscriptionPurchase: CreateYearlySubscriptionPurchase["func"] =
  async ({ accountId, ...arg }) => {
    const purchase = newYearlySubscription(arg);
    return await writeNewSubscriptionPurchase({ accountId, purchase });
  };
