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
      <Button color="warning">warning</Button>
      <Button disabled color="warning">
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
      <Button isLoading color="warning">
        warning
      </Button>
    </Buttons>
  );
};
