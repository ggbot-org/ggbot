import { FC, FormEventHandler, FormHTMLAttributes, PropsWithChildren } from "react";

export type FormProps = FormHTMLAttributes<HTMLFormElement>;

export const Form: FC<PropsWithChildren<FormProps>> = ({ children, ...props }) => {
  return (
    <form className="box" {...props}>
      {children}
    </form>
  );
};

export type FormOnReset = FormEventHandler<HTMLFormElement>;

export type FormOnSubmit = FormEventHandler<HTMLFormElement>;
