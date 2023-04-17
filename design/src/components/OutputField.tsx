import { FC } from "react";
import { InputField, InputFieldProps } from "./InputField.js";

export type OutputFieldClassNames = "output-field";

export type OutputFieldProps = Pick<
  InputFieldProps,
  "color" | "help" | "label" | "value"
>;

export const OutputField: FC<OutputFieldProps> = ({ value, ...props }) => {
  return (
    <InputField
      className={"output-field"}
      defaultValue={value}
      readOnly
      {...props}
    />
  );
};
