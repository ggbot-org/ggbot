import { FC, useState } from "react";
import { EditableInput, EditableInputField, Section } from "@ggbot2/design";

export const EditableInputs: FC = () => {
  const [value, setValue] = useState("");

  return (
    <div>
      <div>
        <EditableInput value={value} setValue={setValue} />
        <EditableInput isSpinning value={value} setValue={setValue} />
      </div>

      <Section>
        <EditableInputField
          label="name"
          name="name"
          value={value}
          setValue={setValue}
        />
      </Section>
    </div>
  );
};
