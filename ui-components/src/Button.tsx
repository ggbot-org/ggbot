import { ButtonHTMLAttributes, FC, useMemo } from "react";
import { Spinner } from "./Spinner";

type Color = "primary" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: Color;
  isSpinning?: boolean;
};

function colorClassNames({
  disabled,
  color,
  isSpinning,
}: Pick<Props, "color" | "disabled" | "isSpinning">) {
  switch (true) {
    case disabled:
      return "border-transparent bg-mono-100 text-mono-400 cursor-not-allowed";
    case color === "primary":
      return [
        "border-primary-400",
        isSpinning
          ? "bg-primary-300 text-primary-800"
          : "bg-primary-50 text-primary-500",
        "focus:bg-primary-300 focus:text-primary-800 focus:ring-primary-400 hover:bg-primary-300 hover:text-primary-800 active:bg-primart-300 active:text-primary-800",
      ].join(" ");
    case color === "danger":
      return [
        "border-danger-400",
        isSpinning
          ? "bg-danger-400 text-danger-50"
          : "bg-danger-50 text-danger-700",
        "focus:bg-danger-400 focus:text-danger-50 focus:ring-danger-300 hover:bg-danger-400 hover:text-danger-50 active:bg-danger-400 active:text-danger-50",
      ].join(" ");
    default:
      return [
        "border-mono-600",
        isSpinning ? "bg-mono-700 text-mono-200" : "bg-mono-50 text-mono-800",
        "focus:bg-mono-700 focus:text-mono-200 focus:ring-mono-400 hover:bg-mono-700 hover:text-mono-200 active:bg-mono-700 active:text-mono-200",
      ].join(" ");
  }
}

export const Button: FC<Props> = ({
  children,
  color,
  disabled,
  isSpinning,
  tabIndex: _tabIndex,
  ...props
}) => {
  const buttonClassName = useMemo(() => {
    return [
      "relative border rounded-md whitespace-nowrap select-none",
      "px-4 leading-10",
      "font-medium",
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
      ["inline-flex items-center gap-2", isSpinning ? "invisible" : ""].join(
        " "
      ),
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
