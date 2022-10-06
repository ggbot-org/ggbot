import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useState,
} from "react";
import {
  Button,
  Checkbox,
  Icon,
  InputField,
  Fieldset,
  SelectField,
} from "../src";

export const SimpleForm: FC = () => {
  const [isPending, setIsPending] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  const onChangeConsent = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setHasConsent(event.target.checked);
    },
    [setHasConsent]
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
      <Fieldset
        legend={
          <div className="inline-flex items-center gap-4">
            <Icon name="account" size={25} />
            <span className="text-lg">create account</span>
          </div>
        }
      >
        <InputField name="nick" label="nick" />
        <InputField name="password" label="password" />
        <SelectField
          name="gender"
          label="gender"
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
      </Fieldset>
    </form>
  );
};
