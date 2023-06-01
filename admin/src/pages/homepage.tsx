import { Accounts } from "_components/Accounts";
import { mount } from "@ggbot2/react";
import { FC } from "react";

export const Page: FC = () => (
  <>
    <h1>ggbot2</h1>
    <Accounts />
  </>
);

mount(Page);
