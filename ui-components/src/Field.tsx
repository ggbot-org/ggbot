import { FC, ReactNode } from "react";
import { Input, InputProps } from "./Input";

type Props = InputProps & {
  label: ReactNode;
  name: string;
};

export const Field: FC<Props> = ({ label, name, ...inputProps }) => {
  return (
    <div className="w-full py-2">
      <label htmlFor={name}>{label}</label>
      <Input {...inputProps} id={name} name={name} />
    </div>
  );
};
