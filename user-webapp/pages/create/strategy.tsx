import { Button, Field } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { FormEventHandler, useCallback, useState } from "react";
import { Content } from "_components";
import { CREATE_STRATEGY_IN, useApiAction } from "_hooks";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  const [newStrategy, setNewStrategy] = useState<CREATE_STRATEGY_IN>();

  const { data } = useApiAction.CREATE_STRATEGY(newStrategy);
  console.log(data);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>((event) => {
    event.preventDefault();

    const name = (event.target as EventTarget & { name: { value: string } })
      .name.value;
    setNewStrategy({ kind: "binance", name });
  }, []);

  return (
    <Content>
      <form onSubmit={onSubmit}>
        new strategy
        <Field label="strategy name" name="name" required />
        <Button color="primary">create</Button>
      </form>
    </Content>
  );
};

export default Page;
