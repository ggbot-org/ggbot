import { FC, InputHTMLAttributes, ReactNode, useId, useMemo } from "react";
import { Field, FieldProps } from "./Field";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "type"
> & {
  type?: "text" | "password" | "email";
  icon?: ReactNode;
};

export const Input: FC<InputProps> = ({
  icon,
  disabled,
  readOnly,
  ...props
}) => {
  const inputClassName = useMemo(() => {
    return [
      "w-full rounded-md px-4 py-2",
      "shadow outline-dark-600",
      readOnly ? "cursor-default" : "",
    ].join(" ");
  }, [readOnly]);

  return (
    <div className="relative w-full">
      <input className={inputClassName} readOnly={readOnly} {...props} />
      {icon ? (
        <div className="absolute top-0 right-0 h-full flex items-center">
          {icon}
        </div>
      ) : null}
    </div>
  );
};

type InputFieldProps = Omit<FieldProps, "htmlFor"> & Omit<InputProps, "id">;

export const InputField: FC<InputFieldProps> = ({ label, ...props }) => {
  const id = useId();
  return (
    <Field label={label} htmlFor={id}>
      <Input id={id} {...props} />
    </Field>
  );
};
