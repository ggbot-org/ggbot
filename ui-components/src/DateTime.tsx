import { isInvalidDate } from "@ggbot2/time";
import { FC, useEffect, useMemo, useState } from "react";

const dateTimeFormats = ["day", "time"];
type DateTimeFormat = typeof dateTimeFormats[number];

type Props = {
  value: number | string;
  format: DateTimeFormat;
};

export const DateTime: FC<Props> = ({ format, value }) => {
  const dateTimeValue = useMemo(() => value?.toString(), [value]);

  const [formattedValue, setFormattedValue] = useState("");

  useEffect(() => {
    try {
      const date = new Date(value);
      if (isInvalidDate(date)) return;

      const dateString = date.toLocaleDateString();

      if (format === "day") setFormattedValue(dateString);

      if (format === "time")
        setFormattedValue(`${dateString} ${date.toLocaleTimeString()}`);
    } catch (error) {
      console.error(error);
    }
  }, [format, setFormattedValue, value]);

  return <time dateTime={dateTimeValue}>{formattedValue}</time>;
};
