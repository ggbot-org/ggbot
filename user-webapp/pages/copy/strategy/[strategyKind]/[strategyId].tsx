import {
  ErrorInvalidName,
  ErrorNameToLong,
  isName,
  throwIfInvalidName,
} from "@ggbot2/models";
import { Button, DateTime, Field } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { Content, Navigation } from "_components";
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

  const [isDisabled, setIsDisabled] = useState(true);

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

  const onChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      if (isName(event.target.value)) setIsDisabled(false);
      else setIsDisabled(true);
    },
    [setIsDisabled]
  );

  useEffect(() => {
    if (!data) return;
    router.push(route.homePage());
  }, [router, data]);

  return (
    <Content topbar={<Navigation hasSettingsIcon />}>
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
          onChange={onChangeName}
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
            <Button isLoading={isLoading} disabled={isDisabled}>
              copy
            </Button>
          </menu>
        )}
      </form>
    </Content>
  );
};

export default Page;
