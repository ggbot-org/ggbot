import { isSubscription, subscriptionStatus } from "@ggbot2/models";
import { dayToTime, getTime, now } from "@ggbot2/time";
import { useEffect, useMemo } from "react";
import { useApiAction } from "./useApiAction";

// TODO cache subscription data in session storage
// put it in a React context
export const useSubscription = () => {
  const [readSubscription, { data: subscription, isPending: readSubscriptionIsPending }] =
    useApiAction.ReadSubscription();

  const { canPurchaseSubscription, hasActiveSubscription, subscriptionEnd, subscriptionPlan } =
    useMemo(() => {
      if (subscription === undefined) {
        return {
          canPurchaseSubscription: undefined,
          hasActiveSubscription: undefined,
          subscriptionEnd: undefined,
          subscriptionPlan: undefined,
        };
      }
      if (!isSubscription(subscription))
        return {
          canPurchaseSubscription: true,
          hasActiveSubscription: false,
          subscriptionEnd: undefined,
          subscriptionPlan: undefined,
        };
      return {
        canPurchaseSubscription: getTime(dayToTime(subscription.end)).minus(30).days() < now(),
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
