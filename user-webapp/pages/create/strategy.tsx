import { ErrorInvalidArg, isName, throwIfInvalidName } from "@ggbot2/models";
import { Button, InputField, Section } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationLabel,
  NavigationSettingsIcon,
} from "_components";
import { useApiAction } from "_hooks";
import { requireAuthentication, route } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  const router = useRouter();

  const [create, { data, isPending }] = useApiAction.CreateStrategy();

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      try {
        event.preventDefault();
        if (isPending) return;
        const name = (event.target as EventTarget & { name: { value: string } })
          .name.value;
        throwIfInvalidName(name);
        if (isName(name)) create({ kind: "binance", name });
      } catch (error) {
        if (error instanceof ErrorInvalidArg)
          toast.error("Invalid strategy name");
      }
    },
    [create, isPending]
  );

  useEffect(() => {
    if (!data) return;
    router.push(route.homePage());
  }, [data, router]);

  return (
    <Content
      topbar={
        <Navigation
          breadcrumbs={[
            { content: <NavigationBreadcrumbDashboard isLink /> },
            { content: <NavigationLabel text="new strategy" />, current: true },
          ]}
          icon={<NavigationSettingsIcon />}
        />
      }
    >
      <form
        className="flex flex-col w-full max-w-lg p-4 gap-4"
        onSubmit={onSubmit}
      >
        <Section header="New strategy">
          <InputField
            label="strategy name"
            name="name"
            required
            readOnly={isPending}
          />
          {data ? (
            <div>done</div>
          ) : (
            <menu>
              <li>
                <Button color="primary" isSpinning={isPending}>
                  create
                </Button>
              </li>
            </menu>
          )}
        </Section>
      </form>
    </Content>
  );
};

export default Page;
