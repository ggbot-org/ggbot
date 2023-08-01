import { InputField, InputFieldProps, InputOnChange } from "@ggbot2/design";
import { isName, normalizeName } from "@ggbot2/models";
import { Dispatch, FC, SetStateAction, useCallback } from "react";
import { useIntl } from "react-intl";

export type NameProps = Omit<InputFieldProps, "color" | "help" | "type"> &
  Partial<{
    setValue: Dispatch<SetStateAction<string>>;
  }>;

export const Name: FC<NameProps> = ({
  setValue,
  readOnly,
  value,
  ...props
}) => {
  const { formatMessage } = useIntl();

  const name = typeof value === "string" ? value : "";

  const onChange = useCallback<InputOnChange>(
    (event) => {
      setValue?.(event.target.value);
    },
    [setValue]
  );

  let color: InputFieldProps["color"] = undefined;
  let help = "";

  if (name.length > 0) {
    if (name !== normalizeName(name)) {
      help = formatMessage({ id: "Name.hasSpaces" });
      color = "warning";
    }
    if (!isName(name)) {
      help = formatMessage({ id: "Name.invalid" });
      color = "danger";
    }
  }

  return (
    <InputField
      onChange={setValue ? onChange : undefined}
      color={color}
      help={help}
      value={value}
      readOnly={readOnly}
      spellCheck="false"
      type="text"
      {...props}
    />
  );
};
