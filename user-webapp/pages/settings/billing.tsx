import { NextPage } from "next";
import { SubscriptionContext } from "_contexts";
import { useSubscription } from "_hooks";
import { SettingsBillingPage } from "_pages";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  const subscription = useSubscription();

  return (
    <SubscriptionContext.Provider value={subscription}>
      <SettingsBillingPage />
    </SubscriptionContext.Provider>
  );
};

export default Page;
