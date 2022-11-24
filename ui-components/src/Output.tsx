import type { FC, ReactNode } from "react";
import { Field, FieldProps } from "./Field";

export type OutputProps = {
  children: ReactNode;
};

export const Output: FC<OutputProps> = ({ children }) => (
  <output className="w-full rounded-md px-4 py-2 shadow outline-dark-600">
    {children}
  </output>
);

type OutputFieldProps = Omit<FieldProps, "htmlFor"> & OutputProps;

export const OutputField: FC<OutputFieldProps> = ({
  label,
  children,
  ...props
}) => {
  return (
    <Field label={label}>
      <Output {...props}>{children}</Output>
    </Field>
  );
};
