import { FC, useMemo } from "react";
import { DateTimeFormat, DateTimeValue, useFormattedDate } from "../hooks/useFormattedDate";

type Props = {
  value: DateTimeValue;
  format: DateTimeFormat;
};

export const DateTime: FC<Props> = ({ format, value }) => {
  const dateTimeValue = useMemo(() => value?.toString(), [value]);
  const formattedValue = useFormattedDate(value, format);
  return <time dateTime={dateTimeValue}>{formattedValue}</time>;
};
