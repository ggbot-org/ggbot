import {
  Button,
  Checkbox,
  type CheckboxOnChange,
  classNames,
  Flex,
  Form,
  FormOnSubmit,
  InputField,
  SelectField,
  SelectOnChange,
  Title,
} from "@ggbot2/design";
import { FC, useCallback, useState } from "react";

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
    <Form box onSubmit={onSubmit}>
      <Title>Create account</Title>

      <InputField
        name="nick"
        label="nick"
        defaultValue="satoshi"
        help={<>&nbsp;</>}
      />

      <InputField name="password" label="password" help={<>&nbsp;</>} />

      <SelectField
        value={gender}
        name="gender"
        label="gender"
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
          <span className={classNames("ml-2")}>
            I agree with Terms of service.
          </span>
        </Checkbox>

        <Button
          color={hasConsent ? "primary" : undefined}
          disabled={!hasConsent}
          isLoading={isPending}
        >
          Enter
        </Button>
      </Flex>
    </Form>
  );
};
