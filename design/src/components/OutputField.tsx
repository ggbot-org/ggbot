import { FC } from "react";

import { _classNames } from "./_classNames";
import { InputField, InputFieldProps } from "./InputField";

export type OutputFieldClassNames = "OutputField";

export type OutputFieldProps = Pick<
  InputFieldProps,
  "color" | "help" | "label" | "value"
>;

export const OutputField: FC<OutputFieldProps> = ({ value, ...props }) => (
  <InputField
    readOnly
    className={_classNames("OutputField")}
    defaultValue={value}
    {...props}
  />
);
