import {
  OutputField,
  OutputFieldProps,
  useFormattedDate,
} from "@ggbot2/design";
import { FC } from "react";
import { useIntl } from "react-intl";

type Props = Pick<OutputFieldProps, "value">;

export const WhenCreated: FC<Props> = ({ value }) => {
  const { formatMessage } = useIntl();

  const formattedValue = useFormattedDate(
    typeof value === "string" || typeof value === "number" ? value : null,
    "day"
  );

  return (
    <OutputField
      label={formatMessage({ id: "WhenCreated.label" })}
      value={formattedValue}
    />
  );
};
