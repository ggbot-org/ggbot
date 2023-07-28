import { InputField, InputFieldProps, useFormattedDate } from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<InputFieldProps, "label" | "readOnly">;

export const WhenCreated: FC<Props> = ({ value, ...props }) => {
  const { formatMessage } = useIntl();

  const formattedValue = useFormattedDate(
    typeof value === "string" || typeof value === "number" ? value : null,
    "day"
  );

  return (
    <InputField
      readOnly
      label={formatMessage({ id: "WhenCreated.label" })}
      value={formattedValue}
      {...props}
    />
  );
};
