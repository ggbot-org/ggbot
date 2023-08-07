import { FC, ReactNode, useId, useMemo } from "react";
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
  value: inputValue,
  ...props
}) => {
  const id = useId();

  const value = useMemo<
    Pick<InputProps, "defaultValue" | "readOnly" | "value">
  >(
    () => ({
      defaultValue: readOnly ? inputValue : undefined,
      readOnly,
      value: readOnly ? undefined : inputValue,
    }),
    [readOnly, inputValue]
  );

  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>

      <Control isLoading={isLoading}>
        <Input
          id={id}
          color={color}
          readOnly={readOnly}
          {...value}
          {...props}
        />
      </Control>

      {help ? <Help color={color}>{help}</Help> : null}
    </Field>
  );
};
