import { Checkbox, CheckboxProps } from "@ggbot2/ui-components";
import { FC, useId, useMemo } from "react";

type Props = Omit<CheckboxProps, "id">;

export const BacktestCheckbox: FC<Props> = ({ checked, ...props }) => {
  const id = useId();

  const className = useMemo(
    () =>
      [
        "px-2 rounded transition-all ease-in",
        checked
          ? "ring-2 ring-primary-400"
          : "hover:ring-2 hover:ring-primary-400",
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
        <span className="select-none text-xs uppercase leading-10">
          backtest
        </span>
        <Checkbox color="primary" id={id} checked={checked} {...props} />
      </label>
    </div>
  );
};
