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
}: Pick<Props, "color" | "disabled">) {
  switch (true) {
    case disabled:
      return "border-transparent bg-mono-100 text-mono-400 cursor-not-allowed";
    case color === "primary":
      return "border-primary-400 bg-primary-50 text-primary-500 focus:bg-primary-300 focus:text-primary-800 focus:ring-primary-400 hover:bg-primary-300 hover:text-primary-800";
    case color === "danger":
      return "border-danger-400 bg-danger-50 text-danger-700 focus:bg-danger-400 focus:text-danger-50 focus:ring-danger-300 hover:bg-danger-400 hover:text-danger-50";
    default:
      return "border-mono-600 bg-mono-50 text-mono-800 focus:bg-mono-700 focus:text-mono-200 focus:ring-mono-400 hover:bg-mono-700 hover:text-mono-200";
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
        <Spinner
          className="absolute text-white"
          style={{ left: "calc(50% - 5px)" }}
        />
      )}
      <div className={contentClassName}>
        {children ? children : <>&nbsp;</>}
      </div>
    </button>
  );
};
