import { FC } from "react";
import { Button, Buttons } from "../src";

export const ButtonColors: FC = () => {
  return (
    <Buttons>
      <Button>button</Button>
      <Button disabled>disabled</Button>
      <Button color="primary">primary</Button>
      <Button disabled color="primary">
        disabled
      </Button>
      <Button color="danger">danger</Button>
      <Button disabled color="danger">
        disabled
      </Button>
    </Buttons>
  );
};

export const LoadingButtons: FC = () => {
  return (
    <Buttons>
      <Button isLoading>button</Button>
      <Button isLoading color="primary">
        primary
      </Button>
      <Button isLoading color="danger">
        danger
      </Button>
    </Buttons>
  );
};
