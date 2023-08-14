import { InputField, InputFieldProps } from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Omit<InputFieldProps, "label" | "defaultValue">;

const truncateApiKey = (apiKey: InputFieldProps["value"]) =>
  typeof apiKey === "string"
    ? `${apiKey.substring(0, 10)}...${apiKey.substring(
        apiKey.length - 10,
        apiKey.length
      )}`
    : "";

export const ApiKey: FC<Props> = ({ isStatic, value, ...props }) => {
  const { formatMessage } = useIntl();

  return (
    <InputField
      label={formatMessage({ id: "ApiKey.label" })}
      value={isStatic ? undefined : value}
      defaultValue={isStatic ? truncateApiKey(value) : undefined}
      {...props}
    />
  );
};
