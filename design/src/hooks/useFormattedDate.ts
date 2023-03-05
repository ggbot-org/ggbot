import { isInvalidDate } from "@ggbot2/time";
import { useEffect, useState } from "react";

const dateTimeFormats = ["day", "time"];
export type DateTimeFormat = typeof dateTimeFormats[number];

export type DateTimeValue = number | string | undefined | null;

export const useFormattedDate = (value: DateTimeValue, format: DateTimeFormat): string => {
  const [formattedValue, setFormattedValue] = useState("");

  useEffect(() => {
    try {
      if (!value) return;
      const date = new Date(value);
      if (isInvalidDate(date)) return;

      if (format === "day")
        setFormattedValue(
          new Intl.DateTimeFormat(window.navigator.language, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
          }).format(date)
        );

      if (format === "time") setFormattedValue(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
    } catch (error) {
      console.error(error);
    }
  }, [format, setFormattedValue, value]);

  return formattedValue;
};
