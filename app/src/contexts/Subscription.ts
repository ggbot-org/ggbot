import { useSubscription } from "_hooks/useSubscription";
import { createContext } from "react";

type ContextValue = ReturnType<typeof useSubscription>;

export const SubscriptionContext = createContext<ContextValue>({
  canPurchaseSubscription: undefined,
  hasActiveSubscription: undefined,
  readSubscriptionIsPending: false,
  subscriptionEnd: undefined,
  subscriptionPlan: undefined,
});

SubscriptionContext.displayName = "SubscriptionContext";
