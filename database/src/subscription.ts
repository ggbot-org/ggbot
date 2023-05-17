import {
  isSubscription,
  ReadSubscription,
  ReadSubscriptionPlan,
  updatedNow,
  WriteSubscription,
} from "@ggbot2/models";

import { getObject, putObject } from "./_dataBucket.js";
import { pathname } from "./locators.js";

export const readSubscription: ReadSubscription["func"] = async (arg) =>
  await getObject<ReadSubscription["out"]>({
    Key: pathname.subscription(arg),
  });

export const writeSubscription: WriteSubscription["func"] = async ({
  accountId,
  ...subscription
}) => {
  const Key = pathname.subscription({ accountId });
  await putObject({ Key, data: subscription });
  return updatedNow();
};

export const readSubscriptionPlan: ReadSubscriptionPlan["func"] = async ({
  accountId,
}) => {
  const subscription = await readSubscription({ accountId });
  const subscriptionPlan = isSubscription(subscription)
    ? subscription.plan
    : null;
  return subscriptionPlan;
};
