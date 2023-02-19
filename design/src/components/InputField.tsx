import { FC, useId } from "react";
import { Control, Field, Label, Input, InputProps } from "trunx";

export type InputFieldProps = Omit<InputProps, "id"> & { label: string };

export const InputField: FC<InputFieldProps> = ({ label, ...props }) => {
  const id = useId();
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Control>
        <Input id={id} {...props} />
      </Control>
    </Field>
  );
};
