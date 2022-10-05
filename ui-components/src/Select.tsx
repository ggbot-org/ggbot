import { FC, OptionHTMLAttributes, SelectHTMLAttributes } from "react";

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className"
> & {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
};

export const Select: FC<SelectProps> = ({ options, ...props }) => {
  return (
    <select className="shadow outline-dark-600 rounded-md px-4 py-2" {...props}>
      {options.map(({ value, ...props }, i) => (
        <option key={i} {...props} />
      ))}
    </select>
  );
};
