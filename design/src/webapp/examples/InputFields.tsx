import { Form, InputField } from "@ggbot2/design";
import { FC } from "react";

export const InputFields: FC = () => (
  <Form>
    <InputField label="normal" />
    <InputField color="primary" label="primary" />
    <InputField color="warning" label="warning" />
    <InputField color="danger" label="danger" />
    <InputField color="success" label="success" />
  </Form>
);