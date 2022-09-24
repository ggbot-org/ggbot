import {
  ErrorInvalidName,
  ErrorNameToLong,
  isName,
  throwIfInvalidName,
} from "@ggbot2/models";
import { Button, Field } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Content, Navigation } from "_components";
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
      try {
        event.preventDefault();
        if (isLoading) return;
        const name = (event.target as EventTarget & { name: { value: string } })
          .name.value;
        throwIfInvalidName(name);
        if (isName(name)) setNewStrategy({ kind: "binance", name });
      } catch (error) {
        if (error instanceof ErrorInvalidName)
          toast.error("Invalid strategy name");
        if (error instanceof ErrorNameToLong)
          toast.error("Strategy name too long");
      }
    },
    [isLoading]
  );

  useEffect(() => {
    if (!data) return;
    router.push(route.homePage());
  }, [data, router]);

  return (
    <Content topbar={<Navigation hasSettingsIcon />}>
      <form
        className="flex flex-col w-full max-w-lg p-4 gap-4"
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
