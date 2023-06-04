import { mount } from "@ggbot2/react";
import { FC } from "react";

import { AuthExitForm } from "../components/AuthExitForm.js";
import { AuthLayout } from "../layouts/Auth.js";

const Page: FC = () => (
  <AuthLayout>
    <AuthExitForm />
  </AuthLayout>
);

mount(Page);
