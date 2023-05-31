import { Accounts } from "_components/Accounts";
import { FC } from "react";
import { createRoot } from "react-dom/client";

export const Page: FC = () => (
  <>
    <h1>ggbot2</h1>

    <Accounts />
  </>
);

const domNode = document.getElementById("root");
if (domNode) {
  const root = createRoot(domNode);
  root.render(<Page />);
}
