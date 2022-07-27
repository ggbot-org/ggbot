import { FC } from "react";
import { Button } from "../src/Button";

export const Buttons: FC = () => {
  return (
    <div className="flex flex-row gap-2 p-2">
      <Button>button</Button>
      <Button color="primary">primary</Button>
      <Button color="danger">danger</Button>
      <Button disabled>disabled</Button>
    </div>
  );
};

export const LoadingButtons: FC = () => {
  return (
    <div className="flex flex-row gap-2 p-2">
      <Button isLoading>button</Button>
      <Button isLoading color="primary">
        primary
      </Button>
      <Button isLoading color="danger">
        danger
      </Button>
    </div>
  );
};
