import { AuthExitForm } from "_components/AuthExitForm";
import { AuthLayout } from "_layouts/Auth";
import { mount } from "@ggbot2/react";
import { FC } from "react";

const Page: FC = () => (
  <AuthLayout>
    <AuthExitForm />
  </AuthLayout>
);

mount(Page);
