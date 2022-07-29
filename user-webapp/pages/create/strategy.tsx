import { isStrategyName } from "@ggbot2/models";
import { Button, Field } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { Content } from "_components";
import { ApiAction, useApiAction } from "_hooks";
import { requireAuthentication, route } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  const router = useRouter();

  const [newStrategy, setNewStrategy] =
    useState<ApiAction["CREATE_STRATEGY"]["in"]>();

  const { data, isLoading } = useApiAction.CREATE_STRATEGY(newStrategy);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (isLoading) return;

      const name = (event.target as EventTarget & { name: { value: string } })
        .name.value;

      if (isStrategyName(name)) setNewStrategy({ kind: "binance", name });
    },
    [isLoading]
  );

  useEffect(() => {
    if (!data) return;
    router.push(route.homePage());
  }, [data, router]);

  return (
    <Content>
      <form
        className="p-4 w-full max-w-lg flex flex-col gap-4"
        onSubmit={onSubmit}
      >
        <span className="text-xl">new strategy</span>
        <Field
          label="strategy name"
          name="name"
          required
          readOnly={isLoading}
        />
        {data ? (
          <div>done</div>
        ) : (
          <menu>
            <Button color="primary" isLoading={isLoading}>
              create
            </Button>
          </menu>
        )}
      </form>
    </Content>
  );
};

export default Page;
