import { FC } from "react";
import { Button } from "../src/Button";
import { Field } from "../src/Field";
import { Fieldset } from "../src/Fieldset";

export const SimpleForm: FC = () => {
  return (
    <form>
      <Fieldset legend="fieldset">
        <Field name="name" label="label" />
      </Fieldset>
      <menu>
        <li>
          <Button>submit</Button>
        </li>
      </menu>
    </form>
  );
};
