import { FC } from "react";

import { _classNames } from "../components/_classNames.js";
import { InputField, InputFieldProps } from "../components/InputField.js";

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
