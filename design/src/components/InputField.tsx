import { FC, ReactNode, useId } from "react";
import {
  Control,
  ControlProps,
  Field,
  Label,
  Help,
  Input,
  InputProps,
} from "trunx";

export type InputFieldProps = Pick<ControlProps, "isLoading"> &
  Omit<InputProps, "id"> & {
    help?: ReactNode;
    label: string;
  };

export const InputField: FC<InputFieldProps> = ({
  color,
  help,
  isLoading,
  label,
  ...props
}) => {
  const id = useId();
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>

      <Control isLoading={isLoading}>
        <Input id={id} color={color} {...props} />
      </Control>

      {help ? <Help color={color}>{help}</Help> : null}
    </Field>
  );
};
