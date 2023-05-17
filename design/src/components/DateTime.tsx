import { FC } from "react";

import {
  DateTimeFormat,
  DateTimeValue,
  useFormattedDate,
} from "../hooks/useFormattedDate";

export type DateTimeProps = {
  value: DateTimeValue;
  format: DateTimeFormat;
};

export const DateTime: FC<DateTimeProps> = ({ format, value }) => {
  const dateTimeValue = value?.toString();
  const formattedValue = useFormattedDate(value, format);
  return <time dateTime={dateTimeValue}>{formattedValue}</time>;
};
