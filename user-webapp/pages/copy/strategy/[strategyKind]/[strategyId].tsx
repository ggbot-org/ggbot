import { ErrorInvalidArg, isName, throwIfInvalidName } from "@ggbot2/models";
import {
  Button,
  DateTime,
  InputField,
  OutputField,
  Section,
} from "@ggbot2/ui-components";
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
  NavigationLabel,
  NavigationSettingsIcon,
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

  const [isDisabled, setIsDisabled] = useState(true);

  const [copyStrategy, { data: whenCopied, isPending }] =
    useApiAction.CopyStrategy();

  const breadcrumbs = useMemo(
    () => [
      { content: <NavigationBreadcrumbDashboard isLink /> },
      {
        content: (
          <NavigationBreadcrumbStrategy strategyKey={strategyKey} isLink />
        ),
      },
      {
        content: <NavigationLabel text="copy" />,
        current: true,
      },
    ],
    [strategyKey]
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      try {
        event.preventDefault();
        if (isPending) return;
        if (whenCopied) return;
        const name = (event.target as EventTarget & { name: { value: string } })
          .name.value;
        throwIfInvalidName(name);
        if (isName(name)) copyStrategy({ name, ...strategyKey });
      } catch (error) {
        if (error instanceof ErrorInvalidArg)
          toast.error("Invalid strategy name");
      }
    },
    [isPending, strategyKey, copyStrategy, whenCopied]
  );

  const onChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      if (isName(event.target.value)) setIsDisabled(false);
      else setIsDisabled(true);
    },
    [setIsDisabled]
  );

  useEffect(() => {
    if (!whenCopied) return;
    router.push(route.homePage());
  }, [router, whenCopied]);

  return (
    <Content
      topbar={
        <Navigation
          breadcrumbs={breadcrumbs}
          icon={<NavigationSettingsIcon />}
        />
      }
    >
      <form
        className="flex flex-col w-full max-w-lg p-4 gap-4"
        onSubmit={onSubmit}
      >
        <Section header="Copy strategy">
          <OutputField label="name">{strategyName}</OutputField>
          <OutputField label="when created">
            <DateTime format="time" value={whenCreated} />
          </OutputField>

          <p>Choose a new name for the copied strategy.</p>

          <InputField
            onChange={onChangeName}
            label="new strategy name"
            name="name"
            placeholder={strategyName}
            required
            readOnly={isPending}
          />

          <menu>
            <li>
              {whenCopied ? (
                <Button color="primary">Done</Button>
              ) : (
                <Button isSpinning={isPending} disabled={isDisabled}>
                  Copy
                </Button>
              )}
            </li>
          </menu>
        </Section>
      </form>
    </Content>
  );
};

export default Page;
