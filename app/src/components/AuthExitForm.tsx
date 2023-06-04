import {
  Button,
  Control,
  Field,
  Form,
  FormOnReset,
  OutputField,
  Title,
} from "@ggbot2/design";
import { isAccount } from "@ggbot2/models";
import { FC, useCallback, useEffect, useState } from "react";

import { useApi } from "../hooks/useApi.js";
import { buttonLabel, fieldLabel } from "../i18n/index.js";
import { pathname } from "../routing/pathnames.js";

export const AuthExitForm: FC = () => {
  const [isPending, setIsPending] = useState(false);

  const [READ_ACCOUNT, { data: account }] = useApi.ReadAccount();

  const email = isAccount(account) ? account.email : "";

  const onReset = useCallback<FormOnReset>((event) => {
    event.preventDefault();
    window.history.back();
  }, []);

  const onSubmit = useCallback(() => {
    setIsPending(true);
  }, [setIsPending]);

  useEffect(() => {
    const controller = READ_ACCOUNT({});
    return () => controller.abort();
  }, [READ_ACCOUNT]);

  return (
    <Form box action={pathname.apiExit()} onReset={onReset} onSubmit={onSubmit}>
      <Title>Exit ggbot2</Title>
      <OutputField label={fieldLabel.email} value={email} />

      <Field isGrouped>
        <Control>
          <Button color="warning" isLoading={isPending}>
            {buttonLabel.exit}
          </Button>
        </Control>
      </Field>
    </Form>
  );
};
