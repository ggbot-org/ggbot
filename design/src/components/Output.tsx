import { FC, PropsWithChildren } from "react";
import { Control, Field, Label } from "trunx";

type OutputFieldProps = { label: string };

export const OutputField: FC<PropsWithChildren<OutputFieldProps>> = ({ label, children }) => {
  return (
    <Field>
      <Label>{label}</Label>
      <Control>
        <output>{children}</output>
      </Control>
    </Field>
  );
};
