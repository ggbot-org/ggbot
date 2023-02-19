import { FC, useId } from "react";
import { Control, Field, Label, Select, SelectProps } from "trunx";

export { SelectOnChange } from "trunx";

type SelectFieldProps = Omit<SelectProps, "id"> & { label: string };

export const SelectField: FC<SelectFieldProps> = ({ label, ...props }) => {
  const id = useId();
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Control>
        <Select id={id} {...props} />
      </Control>
    </Field>
  );
};
