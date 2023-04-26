import { FC, LabelHTMLAttributes, PropsWithChildren, ReactNode } from "react";
// TODO remove this component, use trunx Field (but fix trunx Field to use label)

export type FieldProps = Pick<
  LabelHTMLAttributes<HTMLLabelElement>,
  "htmlFor"
> & {
  label: ReactNode;
};

export const Field: FC<PropsWithChildren<FieldProps>> = ({
  children,
  label,
  htmlFor,
}) => {
  const labelClassName = "mb-3 text-xs font-medium uppercase";

  return (
    <div className="mb-4 flex flex-col">
      {htmlFor ? (
        <label htmlFor={htmlFor} className={labelClassName}>
          {label}
        </label>
      ) : (
        <span className={labelClassName}>{label}</span>
      )}
      {children}
    </div>
  );
};
