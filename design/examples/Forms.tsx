import { FC, useCallback, useState } from "react";
import {
  Button,
  Checkbox,
  type CheckboxOnChange,
  Flex,
  Form,
  FormOnSubmit,
  InputField,
  SelectField,
  SelectOnChange,
  classNames,
} from "@ggbot2/design";

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
        <span className={classNames("title", "is-4", "mx-2", "my-4")}>create account</span>
      </Flex>

      <InputField name="nick" label="nick" color="success" defaultValue="satoshi" help={<>&nbsp;</>} />

      <InputField name="password" label="password" help={<>&nbsp;</>} />

      <SelectField
        value={gender}
        name="gender"
        label="gender"
        color="success"
        help={<>&nbsp;</>}
        onChange={onChangeGender}
        options={[
          { value: "M", label: "Male" },
          { value: "F", label: "Female" },
          { value: "X", label: "Other" },
        ]}
      />

      <Flex alignItems="center" justify="space-between">
        <Checkbox checked={hasConsent} onChange={onChangeConsent}>
          <span className={classNames("ml-2")}>I agree with Terms of service.</span>
        </Checkbox>

        <Button color="primary" disabled={!hasConsent} isLoading={isPending}>
          Enter
        </Button>
      </Flex>
    </Form>
  );
};