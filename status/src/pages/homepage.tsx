import { Navbar } from "@ggbot2/design";
import { FC } from "react";

import { mount } from "./_mount.js";

export const Page: FC = () => <Navbar noMenu />;

mount(Page);
