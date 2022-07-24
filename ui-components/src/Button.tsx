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
      return "bg-dark-200 text-mono-400 outline-none cursor-not-allowed";
    case color === "primary":
      return "text-primary-800 bg-primary-300 hover:bg-primary-400";
    case color === "danger":
      return "text-danger-100 bg-danger-400 hover:bg-danger-500";
    default:
      return "text-mono-200 bg-dark-700 hover:bg-dark-800";
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
      "relative inline-flex items-center rounded-md whitespace-nowrap",
      "px-4 leading-10",
      "font-medium",
      isLoading ? "cursor-default" : "",
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
