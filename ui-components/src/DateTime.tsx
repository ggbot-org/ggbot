import { isInvalidDate } from "@ggbot2/time";
import { FC, useEffect, useMemo, useState } from "react";

const dateTimeFormats = ["day", "time"];
type DateTimeFormat = typeof dateTimeFormats[number];

type Props = {
  value: number | string | undefined;
  format: DateTimeFormat;
};

export const DateTime: FC<Props> = ({ format, value }) => {
  const dateTimeValue = useMemo(() => value?.toString(), [value]);

  const [formattedValue, setFormattedValue] = useState("");

  useEffect(() => {
    try {
      if (value === undefined) return;
      const date = new Date(value);
      if (isInvalidDate(date)) return;

      if (format === "day")
        setFormattedValue(
          new Intl.DateTimeFormat(window.navigator.language, {
            dateStyle: "full",
          }).format(date)
        );

      if (format === "time")
        setFormattedValue(
          `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
        );
    } catch (error) {
      console.error(error);
    }
  }, [format, setFormattedValue, value]);

  return <time dateTime={dateTimeValue}>{formattedValue}</time>;
};
