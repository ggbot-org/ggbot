import { Button } from "@ggbot2/ui-components";
import { NextPage } from "next";
import { Content, Navigation } from "_components";
import { useGoBack } from "_hooks";

const Page: NextPage = () => {
  const goBack = useGoBack();
  return (
    <Content topbar={<Navigation />}>
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-xl">page not found</h2>

        <menu>
          <li>
            <Button onClick={goBack}>Go back</Button>
          </li>
        </menu>
      </div>
    </Content>
  );
};

export default Page;
