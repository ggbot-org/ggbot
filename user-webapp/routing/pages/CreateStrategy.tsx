import {
  Button,
  ButtonProps,
  Control,
  Field,
  Form,
  FormOnSubmit,
  InputField,
  Title,
  formValues,
} from "@ggbot2/design";
import { ErrorInvalidArg, isName, throwIfInvalidName } from "@ggbot2/models";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useApiAction } from "_hooks";
import { fieldLabel } from "_i18n";
import { OneSectionLayout } from "_layouts";
import { route } from "_routing";

const fields = ["name"];
const fieldName = {
  name: "name",
} as const satisfies Record<string, typeof fields[number]>;

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
        const { name } = formValues(event, fields);
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
      <Form box onSubmit={onSubmit}>
        <Title>Create strategy</Title>

        <InputField label={fieldLabel.strategyName} name={fieldName.name} required readOnly={isPending} />

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
