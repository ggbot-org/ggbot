import {
  ErrorInvalidName,
  ErrorNameToLong,
  isName,
  throwIfInvalidName,
} from "@ggbot2/models";
import { Button, DateTime, Field } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Content } from "_components";
import { ApiAction, useApiAction } from "_hooks";
import {
  StrategyInfo,
  requireAuthenticationAndGetStrategyInfo,
  route,
} from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({
  strategyKey: { strategyKind, strategyId },
  name: strategyName,
  whenCreated,
}) => {
  const router = useRouter();

  const [newStrategy, setNewStrategy] =
    useState<ApiAction["COPY_STRATEGY"]["in"]>();

  const { data, isLoading } = useApiAction.COPY_STRATEGY(newStrategy);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      try {
        event.preventDefault();
        if (isLoading) return;
        const name = (event.target as EventTarget & { name: { value: string } })
          .name.value;
        throwIfInvalidName(name);
        if (isName(name)) setNewStrategy({ strategyId, strategyKind, name });
      } catch (error) {
        if (error instanceof ErrorInvalidName)
          toast.error("Invalid strategy name");
        if (error instanceof ErrorNameToLong)
          toast.error("Strategy name too long");
      }
    },
    [isLoading, strategyId, strategyKind]
  );

  useEffect(() => {
    if (!data) return;
    router.push(route.homePage());
  }, [router, data]);

  return (
    <Content>
      <form
        className="flex flex-col w-full max-w-lg p-4 gap-4"
        onSubmit={onSubmit}
      >
        <span className="text-xl">copy strategy</span>
        <dl>
          <dt>name</dt>
          <dd>{strategyName}</dd>
          <dt>created</dt>
          <dd>
            <DateTime format="time" value={whenCreated} />
          </dd>
          <dt>id</dt>
          <dd className="text-xs">{strategyId}</dd>
        </dl>
        <Field
          label="new strategy name"
          name="name"
          placeholder={strategyName}
          required
          readOnly={isLoading}
        />
        {data ? (
          <div>done</div>
        ) : (
          <menu>
            <Button isLoading={isLoading}>copy</Button>
          </menu>
        )}
      </form>
    </Content>
  );
};

export default Page;