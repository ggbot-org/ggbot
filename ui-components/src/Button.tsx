import { ButtonHTMLAttributes, FC, PointerEventHandler, useMemo } from "react";
import { Color } from "./Color";
import { Spinner } from "./Spinner";

export type ButtonOnClick = PointerEventHandler<HTMLButtonElement>;

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> & {
  color?: Extract<Color, "primary" | "danger">;
  isSpinning?: boolean;
};

function colorClassNames({
  disabled,
  color,
  isSpinning,
}: Pick<ButtonProps, "color" | "disabled" | "isSpinning">) {
  switch (true) {
    case disabled:
      return "border-transparent bg-neutral-100 text-neutral-400 cursor-not-allowed";
    case color === "primary":
      return [
        "border-cyan-400",
        isSpinning ? "bg-cyan-300 text-cyan-800" : "bg-cyan-50 text-cyan-500",
        "focus:bg-cyan-300 focus:text-cyan-800 focus:ring-cyan-400 hover:bg-cyan-300 hover:text-cyan-800 active:bg-primart-300 active:text-cyan-800",
      ].join(" ");
    case color === "danger":
      return [
        "border-yellow-400",
        isSpinning
          ? "bg-yellow-400 text-yellow-50"
          : "bg-yellow-50 text-yellow-700",
        "focus:bg-yellow-400 focus:text-yellow-50 focus:ring-yellow-300 hover:bg-yellow-400 hover:text-yellow-50 active:bg-yellow-400 active:text-yellow-50",
      ].join(" ");
    default:
      return [
        "border-neutral-600",
        isSpinning
          ? "bg-neutral-700 text-neutral-200"
          : "bg-neutral-50 text-neutral-800",
        "focus:bg-neutral-700 focus:text-neutral-200 focus:ring-neutral-400 hover:bg-neutral-700 hover:text-neutral-200 active:bg-neutral-700 active:text-neutral-200",
      ].join(" ");
  }
}

export const Button: FC<ButtonProps> = ({
  children,
  color,
  disabled,
  isSpinning,
  tabIndex: _tabIndex,
  ...props
}) => {
  const buttonClassName = useMemo(() => {
    return [
      "relative inline-flex items-center border rounded-md whitespace-nowrap select-none",
      isSpinning ? "cursor-default" : "",
      "focus:outline-none focus:ring",
      colorClassNames({
        disabled,
        color,
        isSpinning,
      }),
      "transition-all",
    ].join(" ");
  }, [color, disabled, isSpinning]);

  const contentClassName = useMemo(
    () =>
      [
        "inline-flex items-center",
        "px-4 leading-10 font-medium",
        isSpinning ? "invisible" : "",
      ].join(" "),
    [isSpinning]
  );

  const tabIndex = useMemo(
    () => (disabled ? -1 : _tabIndex),
    [_tabIndex, disabled]
  );

  return (
    <button
      disabled={disabled}
      {...props}
      className={buttonClassName}
      tabIndex={tabIndex}
    >
      {isSpinning && (
        <Spinner className="absolute" style={{ left: "calc(50% - 5px)" }} />
      )}
      <div className={contentClassName}>
        {children ? children : <>&nbsp;</>}
      </div>
    </button>
  );
};
