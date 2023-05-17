import { SubscriptionContext } from "_contexts/Subscription";
import { useSubscription } from "_hooks/useSubscription";
import { BillingSettingsPage } from "_pages/BillingSettings";
import { requireAuthentication } from "_routing/serverSide";
import { NextPage } from "next";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  const subscription = useSubscription();

  return (
    <SubscriptionContext.Provider value={subscription}>
      <BillingSettingsPage />
    </SubscriptionContext.Provider>
  );
};

export default Page;
