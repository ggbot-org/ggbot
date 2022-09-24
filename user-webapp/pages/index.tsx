import type { NextPage } from "next";
import { Content, Navigation, Strategies } from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return (
    <Content topbar={<Navigation hasSettingsIcon />}>
      <Strategies />
    </Content>
  );
};

export default Page;
