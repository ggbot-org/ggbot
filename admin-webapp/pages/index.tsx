import type { NextPage } from "next";
import { Accounts, Page } from "_components";

const Home: NextPage = () => {
  return (
    <Page>
      <h1>ggbot2</h1>
      <Accounts />
    </Page>
  );
};

export default Home;
