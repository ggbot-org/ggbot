/**
 * String with format yyyy-mm-dd
 */
export type Day = string;

export function isDay(day: unknown): day is Day {
  if (typeof day !== "string") return false;
  try {
    const maybeDate = new Date(day);
    return maybeDate.toISOString().substring(0, 10) === day;
  } catch {
    return false;
  }
}

export const getDayFromDate = (date: Date): Day => {
  return date.toISOString().substring(0, 10);
};
