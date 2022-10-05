import { FC, InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type">;

export const Checkbox: FC<Props> = ({ ...props }) => {
  return (
    <input
      type="checkbox"
      className="cursor-pointer accent-primary-300"
      {...props}
    />
  );
};
