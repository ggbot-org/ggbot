import { FC } from "react";
import { AuthExitForm } from "_components";
import { AuthLayout } from "_layouts";

export const AuthExitPage: FC = () => {
  return (
    <AuthLayout>
      <AuthExitForm />
    </AuthLayout>
  );
};
