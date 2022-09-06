import type { NextPage } from "next";
import { AccountSettings, BinanceSettings, Content } from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return (
    <Content>
      <AccountSettings />
      <BinanceSettings />
    </Content>
  );
};

export default Page;
