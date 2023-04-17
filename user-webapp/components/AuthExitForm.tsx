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
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { useApiAction } from "_hooks";
import { buttonLabel, fieldLabel } from "_i18n";
import { pathname } from "_routing/pathnames";

export const AuthExitForm: FC = () => {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const [readAccount, { data: account }] = useApiAction.ReadAccount();

  const email = isAccount(account) ? account.email : "";

  const onReset = useCallback<FormOnReset>(
    (event) => {
      event.preventDefault();
      router.back();
    },
    [router]
  );

  const onSubmit = useCallback(() => {
    setIsPending(true);
  }, [setIsPending]);

  useEffect(() => {
    const controller = readAccount({});
    return () => {
      controller.abort();
    };
  }, [readAccount]);

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

        <Control>
          <Button type="reset">{buttonLabel.goBack}</Button>
        </Control>
      </Field>
    </Form>
  );
};
