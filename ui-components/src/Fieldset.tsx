import { FC, FieldsetHTMLAttributes, ReactNode } from "react";

type Props = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  legend?: ReactNode;
};

export const Fieldset: FC<Props> = ({ children, legend }) => {
  return (
    <fieldset className="max-w-lg my-2 p-4 shadow dark:shadow-black">
      <legend className="px-2">{legend}</legend>
      {children}
    </fieldset>
  );
};
