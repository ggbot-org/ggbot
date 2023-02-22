import { FC, FormEventHandler, FormHTMLAttributes, PropsWithChildren } from "react";

type FormProps = FormHTMLAttributes<HTMLFormElement>;

export const Form: FC<PropsWithChildren<FormProps>> = ({ children, ...props }) => {
  return (
    <form className="box" {...props}>
      {children}
    </form>
  );
};

export type FormOnSubmit = FormEventHandler<HTMLFormElement>;
