import { NextPage } from "next";
import { Navigation } from "_components/Navigation";

const Page: NextPage = () => (
    <>
      <Navigation />
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-xl">page not found</h2>
      </div>
    </>
  );

export default Page;
