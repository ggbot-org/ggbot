import {
  FC,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  ChangeEventHandler,
  KeyboardEventHandler,
} from "react";
import { Field, FieldProps } from "./Field";
import { Input, InputProps } from "./Input";
import { Spinner } from "./Spinner";

export type EditableInputProps = Omit<
  InputProps,
  "defaultValue" | "value" | "onBlur" | "onChange" | "onFocus"
> & {
  value: string;
  setValue: (value: string) => void;
  isSpinning?: boolean;
};

export const EditableInput: FC<EditableInputProps> = ({
  onClick,
  readOnly,
  isSpinning,
  value,
  setValue,
  ...inputProps
}) => {
  const [editing, setEditing] = useState(false);
  const [nextValue, setNextValue] = useState(value);

  const submit = useCallback(() => {
    setEditing(false);
    if (value !== nextValue) setValue(nextValue);
  }, [nextValue, setValue, value]);

  const reset = useCallback(() => {
    setEditing(false);
    setValue(value);
  }, [setEditing, setValue, value]);

  const onBlur = submit;

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      if (!editing) return;
      setNextValue(event.target.value);
    },
    [editing]
  );

  const onFocus = useCallback(() => {
    setEditing(true);
  }, [setEditing]);

  const startEditing = useCallback(() => {
    setEditing(true);
    setNextValue(value);
  }, [value]);

  const isReadonly = useMemo(() => {
    if (readOnly) return true;
    if (isSpinning) return true;
    return false;
  }, [readOnly, isSpinning]);

  const onClickInput = useMemo(
    () => (readOnly ? onClick : startEditing),
    [readOnly, onClick, startEditing]
  );

  const icon = useMemo(() => {
    if (isSpinning) return <Spinner className="text-black" />;
    return null;
  }, [isSpinning]);

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (event) => {
      switch (event.key) {
        case "Enter":
          return submit();
        case "Escape":
          return reset();
        case "Tab":
          event.currentTarget.blur();
          break;
        default:
          break;
      }
    },
    [reset, submit]
  );

  // If prop `value` changes, then update `nextValue`.
  useEffect(() => {
    if (editing) return;
    setNextValue(value);
  }, [editing, value, setNextValue]);

  return (
    <Input
      {...inputProps}
      icon={icon}
      onBlur={onBlur}
      onChange={onChange}
      onClick={onClickInput}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      readOnly={isReadonly}
      value={nextValue}
    />
  );
};

type EditableInputFieldProps = Omit<FieldProps, "htmlFor"> &
  Omit<EditableInputProps, "id">;

export const EditableInputField: FC<EditableInputFieldProps> = ({
  label,
  ...props
}) => {
  const id = useId();
  return (
    <Field label={label} htmlFor={id}>
      <EditableInput id={id} {...props} />
    </Field>
  );
};
