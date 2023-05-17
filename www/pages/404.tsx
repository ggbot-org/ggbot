import { Navigation } from "_components/Navigation";
import { NextPage } from "next";

const Page: NextPage = () => (
  <>
    <Navigation />

    <div className="p-4 flex flex-col gap-2">
      <h2 className="text-xl">page not found</h2>
    </div>
  </>
);

export default Page;
