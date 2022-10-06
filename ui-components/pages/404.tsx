import type { NextPage } from "next";
import { Navigation } from "../examples";

const Page: NextPage = () => {
  return (
    <>
      <Navigation />
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-xl">page not found</h2>
      </div>
    </>
  );
};

export default Page;
