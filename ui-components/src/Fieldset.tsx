import { FC, FieldsetHTMLAttributes, ReactNode } from "react";

type Props = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  legend?: ReactNode;
};

export const Fieldset: FC<Props> = ({ children, legend }) => {
  return (
    <fieldset className="max-w-lg">
      {legend}
      {children}
    </fieldset>
  );
};
