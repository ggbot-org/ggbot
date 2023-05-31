import {
  FC,
  FormEventHandler,
  FormHTMLAttributes,
  PropsWithChildren,
} from "react";

import { _classNames } from "./_classNames.js";

export type FormProps = FormHTMLAttributes<HTMLFormElement>;

export const Form: FC<PropsWithChildren<FormProps>> = ({
  children,
  ...props
}) => (
  <form className={_classNames("box")} {...props}>
    {children}
  </form>
);

export type FormOnReset = FormEventHandler<HTMLFormElement>;

export type FormOnSubmit = FormEventHandler<HTMLFormElement>;
