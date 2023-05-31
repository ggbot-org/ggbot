import { AuthExitForm } from "_components/AuthExitForm";
import { AuthLayout } from "_layouts/Auth";
import { FC } from "react";

import { mount } from "./_mount.js";

const Page: FC = () => (
  <AuthLayout>
    <AuthExitForm />
  </AuthLayout>
);

mount(Page);
