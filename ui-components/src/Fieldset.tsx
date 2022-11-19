import { FC, FieldsetHTMLAttributes, ReactNode } from "react";

type Props = FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  legend?: ReactNode;
};

export const Fieldset: FC<Props> = ({ children, legend }) => {
  const bgColor = "bg-primary-100";
  const fieldsetClassName = `${bgColor} w-full lg:max-w-lg my-2 p-4 shadow dark:shadow-black`;
  const legendClassname = `${bgColor} px-2`;

  return (
    <fieldset className={fieldsetClassName}>
      <legend className={legendClassname}>{legend}</legend>
      {children}
    </fieldset>
  );
};
