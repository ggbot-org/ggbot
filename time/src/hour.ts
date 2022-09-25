export const hours = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
] as const;

/**
 * String with format HH, from 00 to 23.
 */
export type Hour = typeof hours[number];

export const isHour = (arg: unknown): arg is Hour => {
  if (typeof arg !== "string") return false;
  return (hours as readonly string[]).includes(arg);
};
