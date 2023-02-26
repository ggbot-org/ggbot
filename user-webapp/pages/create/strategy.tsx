import { Button, InputField, Form, FormOnSubmit, Section } from "@ggbot2/design";
import { ErrorInvalidArg, isName, throwIfInvalidName } from "@ggbot2/models";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Content, Navigation } from "_components";
import { useApiAction } from "_hooks";
import { requireAuthentication, route } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  const router = useRouter();

  const [create, { data, isPending }] = useApiAction.CreateStrategy();

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      try {
        event.preventDefault();
        if (isPending) return;
        const name = (event.target as EventTarget & { name: { value: string } }).name.value;
        throwIfInvalidName(name);
        if (isName(name)) create({ kind: "binance", name });
      } catch (error) {
        if (error instanceof ErrorInvalidArg) toast.error("Invalid strategy name");
      }
    },
    [create, isPending]
  );

  useEffect(() => {
    if (!data) return;
    router.push(route.homePage());
  }, [data, router]);

  return (
    <Content topbar={<Navigation />}>
      <Form onSubmit={onSubmit}>
        <InputField label="strategy name" name="name" required readOnly={isPending} />
        {data ? (
          <div>done</div>
        ) : (
          <menu>
            <li>
              <Button color="primary" isLoading={isPending}>
                Create
              </Button>
            </li>
          </menu>
        )}
      </Form>
    </Content>
  );
};

export default Page;
