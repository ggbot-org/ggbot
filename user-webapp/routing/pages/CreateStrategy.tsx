import { Button, ButtonProps, Control, Field, Form, FormOnSubmit, InputField, Title } from "@ggbot2/design";
import { ErrorInvalidArg, isName, throwIfInvalidName } from "@ggbot2/models";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useApiAction } from "_hooks";
import { OneSectionLayout } from "_layouts";
import { route } from "_routing";

export const CreateStrategyPage: FC = () => {
  const router = useRouter();

  const [create, { data, isPending }] = useApiAction.CreateStrategy();

  const isDone = useMemo(() => data !== undefined, [data]);
  const isReadonly = useMemo(() => isDone || isPending, [isDone, isPending]);

  const cta = useMemo<{ color: ButtonProps["color"]; text: string }>(
    () => ({ color: isDone ? "primary" : undefined, text: isDone ? "Done!" : "Create" }),
    [isDone]
  );

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (isReadonly) return;
      try {
        const name = (event.target as EventTarget & { name: { value: string } }).name.value;
        throwIfInvalidName(name);
        if (isName(name)) create({ kind: "binance", name });
      } catch (error) {
        if (error instanceof ErrorInvalidArg) toast.error("Invalid strategy name");
      }
    },
    [create, isReadonly]
  );

  useEffect(() => {
    if (!data) return;
    router.push(route.homePage());
  }, [data, router]);

  return (
    <OneSectionLayout>
      <Form onSubmit={onSubmit}>
        <Title>Create strategy</Title>

        <InputField label="Strategy name" name="name" required readOnly={isPending} />

        <Field>
          <Control>
            <Button color={cta.color} isLoading={isPending}>
              {cta.text}
            </Button>
          </Control>
        </Field>
      </Form>
    </OneSectionLayout>
  );
};