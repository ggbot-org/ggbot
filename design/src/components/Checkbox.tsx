import { FC, PropsWithChildren } from "react";
import { Checkbox as _Checkbox, CheckboxProps } from "trunx";

import { classNames } from "../classNames.js";

export type { CheckboxOnChange, CheckboxProps } from "trunx";

export const Checkbox: FC<PropsWithChildren<CheckboxProps>> = ({
  children,
  ...props
}) => (
  <_Checkbox {...props}>
    <span className={classNames("ml-2")}>{children}</span>
  </_Checkbox>
);