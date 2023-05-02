import {
  isSubscription,
  Subscription,
  subscriptionStatus,
} from "@ggbot2/models";
import { Time, dayToTime, getTime, now } from "@ggbot2/time";
import { useEffect } from "react";
import { useApi } from "_hooks/useApi";

export const useSubscription = () => {
  const [READ, { data: subscription, isPending: readSubscriptionIsPending }] =
    useApi.ReadSubscription();

  let canPurchaseSubscription: boolean | undefined;
  let hasActiveSubscription: boolean | undefined;
  let subscriptionEnd: undefined | Time;
  let subscriptionPlan: Subscription["plan"] | undefined;

  if (subscription === null) {
    canPurchaseSubscription = true;
    hasActiveSubscription = false;
  }

  if (isSubscription(subscription)) {
    // TODO 30 should not be hardocoded, put it in models
    canPurchaseSubscription =
      getTime(dayToTime(subscription.end)).minus(30).days() < now();
    hasActiveSubscription = subscriptionStatus(subscription) === "active";
    subscriptionEnd = dayToTime(subscription.end);
    subscriptionPlan = subscription.plan;
  }

  useEffect(() => {
    const controller = READ({});
    return () => controller.abort();
  }, [READ]);

  return {
    canPurchaseSubscription,
    hasActiveSubscription,
    readSubscriptionIsPending,
    subscriptionEnd,
    subscriptionPlan,
  };
};
