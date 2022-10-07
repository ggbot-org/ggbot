import {
  Checkbox,
  CheckboxOnChange,
  CheckboxProps,
} from "@ggbot2/ui-components";
import { FC, useId, useMemo } from "react";

type Props = Omit<CheckboxProps, "color" | "id">;

export type LiveCheckboxOnChange = CheckboxOnChange;

export const LiveCheckbox: FC<Props> = ({ checked, ...props }) => {
  const id = useId();

  const className = useMemo(
    () =>
      [
        "px-2 rounded transition-all ease-in",
        checked
          ? "ring-2 ring-danger-400"
          : "hover:ring-2 hover:ring-danger-400",
      ].join(" "),
    [checked]
  );

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="inline-flex items-center gap-2
      cursor-pointer"
      >
        <span className="select-none text-xs uppercase leading-10">live</span>
        <Checkbox color="danger" id={id} checked={checked} {...props} />
      </label>
    </div>
  );
};
