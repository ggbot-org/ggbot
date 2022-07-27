import { ButtonHTMLAttributes, FC, useMemo } from "react";
import { Spinner } from "./Spinner";

type Color = "primary" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: Color;
  isLoading?: boolean;
};

function colorClassNames({
  disabled,
  color,
  isLoading,
}: Pick<Props, "color" | "disabled" | "isLoading">) {
  switch (true) {
    case disabled:
      return "border-transparent bg-mono-100 text-mono-400 cursor-not-allowed";
    case color === "primary":
      return [
        "border-primary-400",
        isLoading
          ? "bg-primary-300 text-primary-800"
          : "bg-primary-50 text-primary-500",
        "focus:bg-primary-300 focus:text-primary-800 focus:ring-primary-400 hover:bg-primary-300 hover:text-primary-800 active:bg-primart-300 active:text-primary-800",
      ].join(" ");
    case color === "danger":
      return [
        "border-danger-400",
        isLoading
          ? "bg-danger-400 text-danger-50"
          : "bg-danger-50 text-danger-700",
        "focus:bg-danger-400 focus:text-danger-50 focus:ring-danger-300 hover:bg-danger-400 hover:text-danger-50 active:bg-danger-400 active:text-danger-50",
      ].join(" ");
    default:
      return [
        "border-mono-600",
        isLoading ? "bg-mono-700 text-mono-200" : "bg-mono-50 text-mono-800",
        "focus:bg-mono-700 focus:text-mono-200 focus:ring-mono-400 hover:bg-mono-700 hover:text-mono-200 active:bg-mono-700 active:text-mono-200",
      ].join(" ");
  }
}

export const Button: FC<Props> = ({
  children,
  color,
  disabled,
  isLoading,
  tabIndex: _tabIndex,
  ...props
}) => {
  const buttonClassName = useMemo(() => {
    return [
      "relative inline-flex items-center border rounded-md whitespace-nowrap select-none",
      "px-4 leading-10",
      "font-medium",
      isLoading ? "cursor-default" : "",
      "focus:outline-none focus:ring",
      colorClassNames({
        disabled,
        color,
        isLoading,
      }),
      "transition-all",
    ].join(" ");
  }, [color, disabled, isLoading]);

  const contentClassName = useMemo(() => {
    return isLoading ? "invisible" : "";
  }, [isLoading]);

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
      {isLoading && (
        <Spinner className="absolute" style={{ left: "calc(50% - 5px)" }} />
      )}
      <div className={contentClassName}>
        {children ? children : <>&nbsp;</>}
      </div>
    </button>
  );
};
