import type { NextPage } from "next";
import { AccountSettings, Content } from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return (
    <Content>
      <AccountSettings />
    </Content>
  );
};

export default Page;
