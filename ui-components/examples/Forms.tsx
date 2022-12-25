import { FC, FormEventHandler, useCallback, useState } from "react";
import {
  Button,
  Checkbox,
  CheckboxOnChange,
  Icon,
  InputField,
  Section,
  SelectField,
  SelectOnChange,
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

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      setIsPending(true);
    },
    [setIsPending]
  );

  return (
    <form onSubmit={onSubmit}>
      <Section
        header={
          <div className="inline-flex items-center gap-4">
            <Icon name="account" />
            <span>create account</span>
          </div>
        }
      >
        <InputField name="nick" label="nick" />
        <InputField name="password" label="password" />
        <select id="" name="" value="c" onChange={onChangeGender}>
          <option value="a">A</option>
          <option value="b">Bi</option>
          <option value="c">Ci</option>
          <option value="d">Di</option>
        </select>
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
        <div className="inline-flex gap-2 my-4">
          <Checkbox
            id="consent"
            checked={hasConsent}
            onChange={onChangeConsent}
          />
          <label htmlFor="consent" className="cursor-pointer">
            I agree with Terms of service.
          </label>
        </div>
        <menu className="my-2">
          <li>
            <Button disabled={!hasConsent} isSpinning={isPending}>
              enter
            </Button>
          </li>
        </menu>
      </Section>
    </form>
  );
};
