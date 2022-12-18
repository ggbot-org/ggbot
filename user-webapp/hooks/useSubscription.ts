import { isSubscription, subscriptionStatus } from "@ggbot2/models";
import { useEffect, useMemo } from "react";
import { useApiAction } from "./useApiAction";

export const useSubscription = () => {
  const [
    readSubscription,
    { data: subscription, isPending: readSubscriptionIsPending },
  ] = useApiAction.ReadSubscription();

  const hasActiveSubscription = useMemo<boolean | undefined>(() => {
    if (subscription === null) return false;
    if (!isSubscription(subscription)) return;
    const status = subscriptionStatus(subscription);
    return status === "active";
  }, [subscription]);

  useEffect(() => {
    const controller = readSubscription({});
    return () => {
      controller.abort();
    };
  }, [readSubscription]);

  return { hasActiveSubscription, readSubscriptionIsPending, subscription };
};
