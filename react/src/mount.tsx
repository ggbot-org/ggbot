import { FC } from "react";
import { createRoot } from "react-dom/client";

export const mount = (Page: FC) => {
  const domNode = document.getElementById("root");
  if (!domNode) return;
  const root = createRoot(domNode);
  root.render(<Page />);
};
