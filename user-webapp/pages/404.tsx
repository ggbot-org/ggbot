import type { NextPage } from "next";
import { Content } from "_components";

const Page: NextPage = () => {
  return (
    <Content>
      <div className="p-4">
        <span className="text-xl">page not found</span>
      </div>
    </Content>
  );
};

export default Page;
