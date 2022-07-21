import { FC, useEffect, useMemo, useState } from "react";

const dateTimeFormats = ["day", "time"];
type DateTimeFormat = typeof dateTimeFormats[number];

type Props = {
  value: number | string;
  format: DateTimeFormat;
};

export const DateTime: FC<Props> = ({ format, value }) => {
  const dateTimeValue = useMemo(
    () => (value ? value.toString() : undefined),
    [value]
  );

  const [formattedValue, setFormattedValue] = useState("");

  useEffect(() => {
    try {
      const time = new Date(value);
      if (time.toString() === "Invalid Date") return;

      const dateString = time.toLocaleDateString();

      if (format === "day") setFormattedValue(dateString);

      if (format === "time")
        setFormattedValue(`${dateString} ${time.toLocaleTimeString()}`);
    } catch (error) {
      console.error(error);
    }
  }, [format, setFormattedValue, value]);

  return <time dateTime={dateTimeValue}>{formattedValue}</time>;
};
