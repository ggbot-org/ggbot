import { Button, Control, Field, Form, FormOnReset, InputField } from "@ggbot2/design";
import { isAccount } from "@ggbot2/models";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useApiAction } from "_hooks";
import { route } from "_routing";

export const AuthExitForm: FC = () => {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const [readAccount, { data: account }] = useApiAction.ReadAccount();

  const { email } = useMemo(
    () =>
      isAccount(account)
        ? {
            email: account.email,
          }
        : {
            email: "",
          },
    [account]
  );

  const accountInfo = useMemo<{ label: string; value: string }[]>(
    () => [
      {
        label: "Email",
        value: email,
      },
    ],
    [email]
  );

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
    <Form action={route.apiExit()} onReset={onReset} onSubmit={onSubmit} title="Exit ggbot2">
      {accountInfo.map(({ label, value }, i) => (
        <InputField key={i} label={label} readOnly isStatic defaultValue={value} />
      ))}

      <Field isGrouped>
        <Control>
          <Button type="reset">Stay</Button>
        </Control>

        <Control>
          <Button color="danger" isLoading={isPending}>
            Exit
          </Button>
        </Control>
      </Field>
    </Form>
  );
};
