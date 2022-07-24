import { Day, splitDay } from "@ggbot2/time";

export const dayToDirname = (day: Day) => {
  const [yyyy, mm, dd] = splitDay(day);
  return `yyyy=${yyyy}/mm=${mm}/dd=${dd}`;
};
