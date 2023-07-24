import {
  isSubscription,
  SubscriptionPlan,
  subscriptionStatus,
} from "@ggbot2/models";
import { dayToTime, getTime, now, Time } from "@ggbot2/time";
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
} from "react";

import { useApi } from "../hooks/useApi.js";

type ContextValue = {
  canPurchaseSubscription: boolean | undefined;
  hasActiveSubscription: boolean | undefined;
  subscriptionEnd: Time | undefined;
  subscriptionPlan: SubscriptionPlan | undefined;
};

export const SubscriptionContext = createContext<ContextValue>({
  canPurchaseSubscription: undefined,
  hasActiveSubscription: undefined,
  subscriptionEnd: undefined,
  subscriptionPlan: undefined,
});

SubscriptionContext.displayName = "SubscriptionContext";

export const SubscriptionProvider: FC<PropsWithChildren> = ({ children }) => {
  const READ = useApi.ReadSubscription();
  const subscription = READ.data;

  const contextValue = useMemo(() => {
    if (isSubscription(subscription)) {
      return {
        // TODO 30 should not be hardocoded, put it in models
        canPurchaseSubscription:
          getTime(dayToTime(subscription.end)).minus(30).days() < now(),
        hasActiveSubscription: subscriptionStatus(subscription) === "active",
        subscriptionEnd: dayToTime(subscription.end),
        subscriptionPlan: subscription.plan,
      };
    } else {
      return {
        canPurchaseSubscription: undefined,
        hasActiveSubscription: undefined,
        subscriptionEnd: undefined,
        subscriptionPlan: undefined,
      };
    }
  }, [subscription]);

  useEffect(() => {
    if (READ.canRun) READ.request();
  }, [READ]);

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};
