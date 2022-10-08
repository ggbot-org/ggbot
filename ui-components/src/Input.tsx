import { FC, InputHTMLAttributes, useMemo } from "react";
import { Field, FieldProps } from "./Field";
import { Spinner } from "./Spinner";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
> & {
  type?: "text" | "password" | "email";
  isSpinning?: boolean;
};

export const Input: FC<InputProps> = ({
  disabled,
  isSpinning,
  readOnly,
  ...props
}) => {
  const inputClassName = useMemo(() => {
    return [
      "w-full rounded-md px-4 py-2",
      "shadow outline-dark-600",
      readOnly ? "cursor-default" : "",
      isSpinning ? "pointer-events-none" : "",
    ].join(" ");
  }, [isSpinning, readOnly]);

  return (
    <div className="relative w-full">
      <input className={inputClassName} readOnly={readOnly} {...props} />
      {isSpinning ? (
        <div className="absolute top-0 right-0 h-full flex items-center">
          <Spinner className="text-black" />
        </div>
      ) : null}
    </div>
  );
};

type InputFieldProps = FieldProps & Omit<InputProps, "id" | "name">;

export const InputField: FC<InputFieldProps> = ({ label, name, ...props }) => {
  return (
    <Field label={label} name={name}>
      <Input {...props} name={name} />
    </Field>
  );
};
