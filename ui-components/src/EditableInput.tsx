import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
  ChangeEventHandler,
  KeyboardEventHandler,
} from "react";
import { Input, InputProps } from "./Input";

export type EditableInputProps = Omit<
  InputProps,
  "defaultValue" | "value" | "onBlur" | "onChange" | "onFocus"
> & {
  value: string;
  setValue: (value: string) => void;
};

export const EditableInput: FC<EditableInputProps> = ({
  onClick,
  readOnly,
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

  const onClickInput = useMemo(
    () => (readOnly ? onClick : startEditing),
    [readOnly, onClick, startEditing]
  );

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (event) => {
      switch (event.key) {
        case "Enter":
          return submit();
        case "Escape":
          return reset();
        case "Tab":
          event.currentTarget.blur();
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
      onBlur={onBlur}
      onChange={onChange}
      onClick={onClickInput}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      readOnly={readOnly || !editing}
      value={nextValue}
    />
  );
};
