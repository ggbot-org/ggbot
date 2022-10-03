import type { NextPage } from "next";
import { Content, Navigation } from "_components";

const Page: NextPage = () => {
  return (
    <Content topbar={<Navigation />}>
      <div className="p-4">
        <span className="text-xl">page not found</span>
      </div>
    </Content>
  );
};

export default Page;
