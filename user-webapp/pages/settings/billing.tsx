import { NextPage } from "next";
import { SubscriptionContext } from "_contexts";
import { useSubscription } from "_hooks";
import { SettingsBilling } from "_screens";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  const subscription = useSubscription();

  return (
    <SubscriptionContext.Provider value={subscription}>
      <SettingsBilling />
    </SubscriptionContext.Provider>
  );
};

export default Page;
