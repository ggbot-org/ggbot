import { isSubscription, subscriptionStatus } from "@ggbot2/models";
import { dayToTime, getTime, now } from "@ggbot2/time";
import { useEffect, useMemo } from "react";
import { useApiAction } from "./useApiAction";

export const useSubscription = () => {
  const [
    readSubscription,
    { data: subscription, isPending: readSubscriptionIsPending },
  ] = useApiAction.ReadSubscription();

  const {
    canPurchaseSubscription,
    hasActiveSubscription,
    subscriptionEnd,
    subscriptionPlan,
  } = useMemo(() => {
    if (!isSubscription(subscription))
      return {
        canPurchaseSubscription: true,
        hasActiveSubscription: false,
        subscriptionEnd: undefined,
        subscriptionPlan: undefined,
      };
    return {
      canPurchaseSubscription:
        getTime(dayToTime(subscription.end)).minus(1).months() > now(),
      hasActiveSubscription: subscriptionStatus(subscription) === "active",
      subscriptionEnd: dayToTime(subscription.end),
      subscriptionPlan: subscription.plan,
    };
  }, [subscription]);

  useEffect(() => {
    const controller = readSubscription({});
    return () => {
      controller.abort();
    };
  }, [readSubscription]);

  return {
    canPurchaseSubscription,
    hasActiveSubscription,
    readSubscriptionIsPending,
    subscriptionEnd,
    subscriptionPlan,
  };
};
