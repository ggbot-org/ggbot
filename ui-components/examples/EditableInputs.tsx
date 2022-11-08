import { FC, FormEventHandler, useCallback, useState } from "react";
import { EditableInput, EditableInputField, Fieldset } from "../src";

export const EditableInputs: FC = () => {
  const [value, setValue] = useState("");

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>((event) => {
    event.preventDefault();
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <div className="max-w-lg flex flex-col gap-2 wrap">
        <EditableInput value={value} setValue={setValue} />
        <EditableInput value={value} setValue={setValue} isSpinning />
      </div>

      <Fieldset>
        <EditableInputField
          label="name"
          name="name"
          value={value}
          setValue={setValue}
        />
      </Fieldset>
    </form>
  );
};
