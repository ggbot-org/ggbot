import { FC } from "react";
import { InputField, InputFieldProps } from "./InputField";

export type OutputFieldClassNames = "output-field";

export type OutputFieldProps = Pick<
  InputFieldProps,
  "color" | "help" | "label" | "value"
>;

export const OutputField: FC<OutputFieldProps> = ({ value, ...props }) => (
    <InputField
      readOnly
      className={"output-field"}
      defaultValue={value}
      {...props}
    />
  );
