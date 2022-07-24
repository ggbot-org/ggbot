/**
 * String with format yyyy-mm-dd
 */
export type Day = string;

export const isDay = (day: unknown): day is Day => {
  if (typeof day !== "string") return false;
  try {
    const maybeDate = new Date(day);
    return getDayFromDate(maybeDate) === day;
  } catch {
    return false;
  }
};

type Yyyy = string;
type Mm = string;
type Dd = string;

export type SplittedDay = [Yyyy, Mm, Dd];

export const splitDay = (day: Day): SplittedDay => {
  const [yyyy, mm, dd] = day.split("-");
  return [yyyy, mm, dd];
};

export type Today = () => Day;

export const today = () => new Date().toJSON().substring(0, 10);

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
