import { FC, FormEventHandler, useCallback, useState } from "react";
import { Button, Checkbox, Field, Fieldset } from "../src";

export const SimpleForm: FC = () => {
  const [isPending, setIsPending] = useState(false);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      setIsPending(true);
    },
    [setIsPending]
  );

  return (
    <form onSubmit={onSubmit}>
      <Fieldset legend="fieldset">
        <Field name="nick" label="nick" />
        <Field name="password" label="password" />
      </Fieldset>
      <div className="inline-flex gap-2">
        <Checkbox id="consent" />
        <label htmlFor="consent" className="cursor-pointer">
          I agree with Terms of service.
        </label>
      </div>
      <menu>
        <li>
          <Button isSpinning={isPending}>enter</Button>
        </li>
      </menu>
    </form>
  );
};
