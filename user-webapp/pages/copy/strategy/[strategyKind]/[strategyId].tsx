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
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationBreadcrumbStrategy,
  NavigationBreadcrumbLabel,
} from "_components";
import { useApiAction } from "_hooks";
import {
  StrategyInfo,
  requireAuthenticationAndGetStrategyInfo,
  route,
} from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({
  strategyKey,
  name: strategyName,
  whenCreated,
}) => {
  const router = useRouter();

  const { strategyId } = strategyKey;

  const [isDisabled, setIsDisabled] = useState(true);

  const [copyStrategy, { data, isPending }] = useApiAction.COPY_STRATEGY();

  const breadcrumbs = useMemo(
    () => [
      <NavigationBreadcrumbDashboard key={1} isLink />,
      <NavigationBreadcrumbStrategy key={2} strategyKey={strategyKey} isLink />,
      <NavigationBreadcrumbLabel key={3} text="copy" />,
    ],
    [strategyKey]
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      try {
        event.preventDefault();
        if (isPending) return;
        const name = (event.target as EventTarget & { name: { value: string } })
          .name.value;
        throwIfInvalidName(name);
        if (isName(name)) copyStrategy({ data: { name, ...strategyKey } });
      } catch (error) {
        if (error instanceof ErrorInvalidName)
          toast.error("Invalid strategy name");
        if (error instanceof ErrorNameToLong)
          toast.error("Strategy name too long");
      }
    },
    [isPending, strategyKey, copyStrategy]
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
    <Content topbar={<Navigation breadcrumbs={breadcrumbs} hasSettingsIcon />}>
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
          readOnly={isPending}
        />
        {data ? (
          <div>done</div>
        ) : (
          <menu>
            <li>
              <Button isSpinning={isPending} disabled={isDisabled}>
                copy
              </Button>
            </li>
          </menu>
        )}
      </form>
    </Content>
  );
};

export default Page;
