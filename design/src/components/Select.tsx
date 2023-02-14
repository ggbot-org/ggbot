import {
  ChangeEventHandler,
  FC,
  OptionHTMLAttributes,
  SelectHTMLAttributes,
  useId,
} from "react";
import { Field, FieldProps } from "./Field";

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className"
> & {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
};

export type SelectOnChange = ChangeEventHandler<HTMLSelectElement>;

export const Select: FC<SelectProps> = ({ options, ...props }) => {
  return (
    <select
      className="appearance-none w-full shadow outline-dark-600 rounded-md px-4 py-2"
      {...props}
    >
      {options.map((props, i) => (
        <option key={i} {...props} />
      ))}
    </select>
  );
};

type SelectFieldProps = Omit<FieldProps, "htmlFor"> & Omit<SelectProps, "id">;

export const SelectField: FC<SelectFieldProps> = ({ label, ...props }) => {
  const id = useId();
  return (
    <Field label={label} htmlFor={id}>
      <Select id={id} {...props} />
    </Field>
  );
};
