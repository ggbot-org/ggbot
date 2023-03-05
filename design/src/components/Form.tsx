import { FC, FormEventHandler, FormHTMLAttributes, PropsWithChildren } from "react";
import { classNames } from "../classNames";

export type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  title?: string;
};

export const Form: FC<PropsWithChildren<FormProps>> = ({ children, title, ...props }) => {
  return (
    <form className="box" {...props}>
      {title && <p className={classNames("title", "is-4")}>{title}</p>}
      {children}
    </form>
  );
};

export type FormOnReset = FormEventHandler<HTMLFormElement>;

export type FormOnSubmit = FormEventHandler<HTMLFormElement>;
