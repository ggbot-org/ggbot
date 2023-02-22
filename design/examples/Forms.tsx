import { FC, useCallback, useState } from "react";
import {
  Button,
  Checkbox,
  type CheckboxOnChange,
  Control,
  Flex,
  Field,
  Form,
  FormOnSubmit,
  Icon,
  InputField,
  SelectField,
  SelectOnChange,
  classNames,
} from "../src";

export const SimpleForm: FC = () => {
  const [isPending, setIsPending] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [gender, setGender] = useState("");

  const onChangeConsent = useCallback<CheckboxOnChange>(
    (event) => {
      setHasConsent(event.target.checked);
    },
    [setHasConsent]
  );

  const onChangeGender = useCallback<SelectOnChange>(
    (event) => {
      setGender(event.target.value);
    },
    [setGender]
  );

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      setIsPending(true);
    },
    [setIsPending]
  );

  return (
    <Form onSubmit={onSubmit}>
      <Flex direction="row" justify="center" alignItems="center">
        <span className={classNames("title", "is-4", "mx-2")}>create account</span>
      </Flex>

      <InputField name="nick" label="nick" />

      <InputField name="password" label="password" />

      <SelectField
        value={gender}
        name="gender"
        label="gender"
        onChange={onChangeGender}
        options={[
          { value: "M", label: "Male" },
          { value: "F", label: "Female" },
          { value: "X", label: "Other" },
        ]}
      />

      <Field>
        <Control>
          <Checkbox checked={hasConsent} onChange={onChangeConsent}>
            I agree with Terms of service.
          </Checkbox>
        </Control>
      </Field>

      <Field>
        <Control>
          <Button color="primary" disabled={!hasConsent} isLoading={isPending}>
            Enter
          </Button>
        </Control>
      </Field>
    </Form>
  );
};
