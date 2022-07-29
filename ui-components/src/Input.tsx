import { FC, InputHTMLAttributes, useMemo } from "react";
import { Spinner } from "./Spinner";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  isLoading?: boolean;
};

export const Input: FC<InputProps> = ({
  className,
  disabled,
  isLoading,
  readOnly,
  ...props
}) => {
  const inputClassName = useMemo(() => {
    return [
      className,
      "w-full rounded-md px-4 py-2",
      "shadow border border-dark-300 outline-dark-600",
      readOnly ? "cursor-default" : "",
      isLoading ? "pointer-events-none" : "",
    ].join(" ");
  }, [className, isLoading, readOnly]);

  return (
    <div className="relative w-full">
      <input className={inputClassName} readOnly={readOnly} {...props} />
      {isLoading ? (
        <div className="absolute top-0 right-0 h-full flex items-center">
          <Spinner className="text-black" />
        </div>
      ) : null}
    </div>
  );
};
