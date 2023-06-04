import { createContext } from "react";

import { useSubscription } from "../hooks/useSubscription.js";

type ContextValue = ReturnType<typeof useSubscription>;

export const SubscriptionContext = createContext<ContextValue>({
  canPurchaseSubscription: undefined,
  hasActiveSubscription: undefined,
  readSubscriptionIsPending: false,
  subscriptionEnd: undefined,
  subscriptionPlan: undefined,
});

SubscriptionContext.displayName = "SubscriptionContext";
