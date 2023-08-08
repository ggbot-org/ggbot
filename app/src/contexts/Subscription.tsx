import {
  isSubscription,
  statusOfSubscription,
  SubscriptionPlan,
  SubscriptionStatus,
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

type ContextValue = Partial<{
  canPurchaseSubscription: boolean;
  hasActiveSubscription: boolean;
  subscriptionEnd: Time;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: SubscriptionPlan;
}>;

export const SubscriptionContext = createContext<ContextValue>({});

SubscriptionContext.displayName = "SubscriptionContext";

export const SubscriptionProvider: FC<PropsWithChildren> = ({ children }) => {
  const READ = useApi.ReadSubscription();
  const subscription = READ.data;

  const contextValue = useMemo(() => {
    if (subscription === null)
      return {
        canPurchaseSubscription: true,
        hasActiveSubscription: false,
      };
    if (!isSubscription(subscription)) return {};
    const subscriptionStatus = statusOfSubscription(subscription);
    return {
      // TODO 30 should not be hardocoded, put it in models
      canPurchaseSubscription:
        getTime(dayToTime(subscription.end)).minus(30).days() < now(),
      hasActiveSubscription: subscriptionStatus === "active",
      subscriptionEnd: dayToTime(subscription.end),
      subscriptionStatus,
      subscriptionPlan: subscription.plan,
    };
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
