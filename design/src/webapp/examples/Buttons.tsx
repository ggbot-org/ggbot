import { Button, Buttons } from "@ggbot2/design";
import { FC } from "react";

export const ButtonColors: FC = () => (
  <>
    <Buttons>
      <Button>button</Button>
      <Button color="primary">primary</Button>
      <Button color="warning">warning</Button>
      <Button color="danger">danger</Button>
      <Button color="success">success</Button>
    </Buttons>

    <Buttons>
      <Button disabled>disabled</Button>

      <Button disabled color="primary">
        disabled
      </Button>

      <Button disabled color="warning">
        disabled
      </Button>

      <Button disabled color="danger">
        disabled
      </Button>

      <Button disabled color="success">
        disabled
      </Button>
    </Buttons>
  </>
);

export const LoadingButtons: FC = () => (
  <Buttons>
    <Button isLoading>button</Button>

    <Button isLoading color="primary">
      primary
    </Button>

    <Button isLoading color="warning">
      warning
    </Button>

    <Button isLoading color="danger">
      danger
    </Button>

    <Button isLoading color="success">
      success
    </Button>
  </Buttons>
);
