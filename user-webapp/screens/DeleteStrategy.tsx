import {
  Button,
  Section,
  InputField,
  FormOnSubmit,
  Message,
  Field,
  Control,
  useFormattedDate,
} from "@ggbot2/design";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect } from "react";
import { Navigation, Page } from "_components";
import { useApiAction, useGoBack } from "_hooks";
import { StrategyInfo, route } from "_routing";

type Props = Pick<StrategyInfo, "accountIsOwner" | "strategyKey" | "name" | "whenCreated">;

export const DeleteStrategy: FC<Props> = ({ accountIsOwner, strategyKey, name, whenCreated }) => {
  const router = useRouter();

  const goBack = useGoBack();

  const [deleteStrategy, { isPending, data: whenDeleted }] = useApiAction.DeleteStrategy();

  const formattedWhenCreated = useFormattedDate(whenCreated, "time");

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (isPending) return;
      deleteStrategy(strategyKey);
    },
    [isPending, deleteStrategy, strategyKey]
  );

  useEffect(() => {
    if (!whenDeleted) return;
    router.push(route.homePage());
  }, [router, whenDeleted]);

  return (
    <Page topbar={<Navigation />}>
      <Section>
        {accountIsOwner ? (
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <Message header="Delete strategy" color="danger">
              <p>Are you sure you want to delete this strategy?</p>

              <InputField readOnly label="Name" defaultValue={name} />

              <InputField readOnly label="When created" defaultValue={formattedWhenCreated} />

              <Field isGrouped>
                <Control>
                  <Button type="reset" onClick={goBack}>
                    No, go back...
                  </Button>
                </Control>

                <Control>
                  <Button type="submit" color="danger" isLoading={isPending}>
                    Yes, delete it!
                  </Button>
                </Control>
              </Field>
            </Message>
          </form>
        ) : (
          <Message>Cannot delete strategy. Permission denied!</Message>
        )}
      </Section>
    </Page>
  );
};
