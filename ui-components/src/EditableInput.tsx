import {
  FC,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Input, InputProps } from "./Input";

export type EditableInputProps = Omit<
  InputProps,
  "defaultValue" | "value" | "onBlur" | "onChange"
> & {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
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

  const submitValue = useCallback(() => {
    setEditing(false);
    setValue(nextValue);
  }, [nextValue, setValue]);

  const resetValue = useCallback(() => {
    setEditing(false);
    setValue(value);
  }, [setEditing, setValue, value]);

  const onChange = useCallback(
    (event) => {
      if (!editing) return;
      setNextValue(event.target.value);
    },
    [editing]
  );

  const startEditing = useCallback(() => {
    setEditing(true);
    setNextValue(value);
  }, [value]);

  const onClickInput = useMemo(
    () => (readOnly ? onClick : startEditing),
    [readOnly, onClick, startEditing]
  );

  const onKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "Enter": {
          submitValue();
          break;
        }
        case "Escape": {
          resetValue();
          break;
        }
        default: {
          break;
        }
      }
    },
    [resetValue, submitValue]
  );

  // If prop `value` changes, then update `nextValue`.
  useEffect(() => {
    if (editing) return;
    setNextValue(value);
  }, [editing, value, setNextValue]);

  return (
    <Input
      {...inputProps}
      onBlur={submitValue}
      onChange={onChange}
      onClick={onClickInput}
      onKeyDown={onKeyDown}
      readOnly={readOnly || !editing}
      value={nextValue}
    />
  );
};
