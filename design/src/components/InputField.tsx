import { FC, ReactNode, useId } from "react";
import {
  Control,
  ControlProps,
  Field,
  Help,
  Input,
  InputProps,
  Label,
} from "trunx";

export type InputFieldProps = Pick<ControlProps, "isLoading"> &
  Omit<InputProps, "id" | "defaultValue"> & {
    help?: ReactNode;
    label: string;
  };

export const InputField: FC<InputFieldProps> = ({
  color,
  help,
  isLoading,
  label,
  readOnly,
  isStatic,
  value: inputValue,
  ...props
}) => {
  const id = useId();

  let isReadOnly = readOnly;
  if (isStatic) isReadOnly = true;

  const value: Pick<InputProps, "defaultValue" | "readOnly" | "value"> = {
    defaultValue: isReadOnly ? inputValue : undefined,
    readOnly: isReadOnly,
    value: isReadOnly ? undefined : inputValue,
  };

  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>

      <Control isLoading={isLoading}>
        <Input
          id={id}
          color={color}
          readOnly={readOnly}
          isStatic={isStatic}
          {...value}
          {...props}
        />
      </Control>

      {help ? <Help color={color}>{help}</Help> : null}
    </Field>
  );
};
