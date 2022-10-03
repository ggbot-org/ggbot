import { FC } from "react";
import { Button } from "../src/Button";

export const Buttons: FC = () => {
  return (
    <div className="flex flex-row gap-2 wrap">
      <Button>button</Button>
      <Button color="primary">primary</Button>
      <Button color="danger">danger</Button>
      <Button disabled>disabled</Button>
    </div>
  );
};

export const LoadingButtons: FC = () => {
  return (
    <div className="flex flex-row gap-2 wrap">
      <Button isSpinning>button</Button>
      <Button isSpinning color="primary">
        primary
      </Button>
      <Button isSpinning color="danger">
        danger
      </Button>
    </div>
  );
};
