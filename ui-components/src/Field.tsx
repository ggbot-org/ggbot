import { FC, LabelHTMLAttributes, PropsWithChildren, ReactNode } from "react";

export type FieldProps = {
  label: ReactNode;
  name: string;
};

export const Field: FC<PropsWithChildren<FieldProps>> = ({
  children,
  label,
  name,
}) => {
  return (
    <div className="mb-4">
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {children}
    </div>
  );
};

export type FieldLabelProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "className"
> & { children: ReactNode };

export const FieldLabel: FC<FieldLabelProps> = ({ children, ...props }) => {
  return (
    <label className="mb-3 text-xs font-medium uppercase" {...props}>
      {children}
    </label>
  );
};
