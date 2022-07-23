/**
 * String with format yyyy-mm-dd
 */
export type Day = string;

export function isDay(day: unknown): day is Day {
  if (typeof day !== "string") return false;
  try {
    const maybeDate = new Date(day);
    return getDayFromDate(maybeDate) === day;
  } catch {
    return false;
  }
}

export const getDayFromDate = (date: Date): Day | null => {
  const dateString = date.toJSON();

  // Notice that invalid dates could return a null JSON
  //
  //     new Date('0000-00-00').toJSON() // null
  if (typeof dateString === "string") return dateString.substring(0, 10);

  // Despite TypeScript may see this as
  //
  //     const dateString: never
  //
  // it should be null here. See also related test in ./day.spec.ts file.
  return dateString;
};
