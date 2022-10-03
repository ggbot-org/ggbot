import type { NextPage } from "next";
import {
  AccountSettings,
  BinanceSettings,
  Content,
  Navigation,
} from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return (
    <Content topbar={<Navigation brandLinksToHomepage />}>
      <AccountSettings />
      <BinanceSettings />
    </Content>
  );
};

export default Page;
