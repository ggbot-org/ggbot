import { FC, ReactNode } from "react";
import { Input, InputProps } from "./Input";

type Props = InputProps & {
  label: ReactNode;
  name: string;
};

export const Field: FC<Props> = ({ label, name, ...inputProps }) => {
  const containerClassName = "w-full py-2";
  const labelClassName = "font-semibold text-sm uppercase my-2";
  return (
    <div className={containerClassName}>
      <label htmlFor={name} className={labelClassName}>
        {label}
      </label>
      <Input {...inputProps} id={name} name={name} />
    </div>
  );
};
