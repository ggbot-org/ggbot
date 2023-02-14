import { ChangeEventHandler, FC, InputHTMLAttributes, ReactNode, useId, useMemo } from "react";
import { Control, Field, Label } from "trunx";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type"> & {
  type?: "text" | "password" | "email" | "number";
  icon?: ReactNode;
};

export type InputOnChange = ChangeEventHandler<HTMLInputElement>;

export const Input: FC<InputProps> = ({ icon, disabled, readOnly, ...props }) => {
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
      {icon ? <div className="absolute top-0 right-0 h-full flex items-center">{icon}</div> : null}
    </div>
  );
};

type InputFieldProps = Omit<InputProps, "id"> & { label: string };

export const InputField: FC<InputFieldProps> = ({ label, ...props }) => {
  const id = useId();
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Control>
        <Input id={id} {...props} />
      </Control>
    </Field>
  );
};
