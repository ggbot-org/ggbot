import { FC, FormEventHandler, useCallback, useState } from "react";
import { Button, Checkbox, Field, Fieldset, Select } from "../src";

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
      <Fieldset legend="account">
        <Field name="nick" label="nick" />
        <Field name="password" label="password" />
        <Select
          options={[
            { value: "M", label: "Male" },
            { value: "F", label: "Female" },
            { value: "X", label: "Other" },
          ]}
        />
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
