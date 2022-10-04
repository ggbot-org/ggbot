import { FC, InputHTMLAttributes } from "react";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox: FC<CheckboxProps> = ({ ...props }) => {
  return <input type="checkbox" {...props} />;
};
