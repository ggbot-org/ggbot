import { Button, Control, Field, Form, FormOnReset, InputField, Title } from "@ggbot2/design";
import { isAccount } from "@ggbot2/models";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useApiAction } from "_hooks";
import { buttonLabel, fieldLabel } from "_i18n";
import { route } from "_routing";

export const AuthExitForm: FC = () => {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const [readAccount, { data: account }] = useApiAction.ReadAccount();

  const email = useMemo(() => (isAccount(account) ? account.email : ""), [account]);

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
    <Form action={route.apiExit()} onReset={onReset} onSubmit={onSubmit}>
      <Title>Exit ggbot2</Title>

      <InputField label={fieldLabel.email} readOnly defaultValue={email} />

      <Field isGrouped>
        <Control>
          <Button color="danger" isLoading={isPending}>
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
