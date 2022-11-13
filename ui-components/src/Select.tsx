import { FC, OptionHTMLAttributes, SelectHTMLAttributes } from "react";
import { Field, FieldProps } from "./Field";

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className"
> & {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
};

export const Select: FC<SelectProps> = ({ options, ...props }) => {
  return (
    <select
      className="appearance-none w-full shadow outline-dark-600 rounded-md px-4 py-2"
      {...props}
    >
      {options.map(({ value, ...props }, i) => (
        <option key={i} {...props} />
      ))}
    </select>
  );
};

type SelectFieldProps = FieldProps & Omit<SelectProps, "name">;

export const SelectField: FC<SelectFieldProps> = ({
  label,
  name,
  ...props
}) => {
  return (
    <Field label={label} name={name}>
      <Select {...props} name={name} />
    </Field>
  );
};
