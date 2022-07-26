import type { NextPage } from "next";
import { Content, Strategies } from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return (
    <Content>
      <Strategies />
    </Content>
  );
};

export default Page;
