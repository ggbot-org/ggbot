import { ButtonHTMLAttributes, FC, useMemo } from "react";
import { Spinner } from "./Spinner";

type Color = "primary" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: Color;
  loading?: boolean;
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
  disabled,
  loading,
  color,
  tabIndex: _tabIndex,
  ...props
}) => {
  const buttonClassName = useMemo(() => {
    return [
      "relative inline-flex items-center rounded-md whitespace-nowrap",
      "px-4 leading-10",
      "font-medium",
      loading ? "cursor-default" : "",
      colorClassNames({
        disabled,
        color,
      }),
      "transition-all",
    ].join(" ");
  }, [disabled, loading, color]);

  const contentClassName = useMemo(() => {
    return loading ? "invisible" : "";
  }, [loading]);

  const tabIndex = useMemo(() => {
    return disabled ? -1 : _tabIndex;
  }, [disabled, _tabIndex]);

  return (
    <button
      disabled={disabled}
      {...props}
      className={buttonClassName}
      tabIndex={tabIndex}
    >
      {loading && (
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
