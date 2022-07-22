import { getDayFromDate } from "./day.js";

export const truncateDate = (date: Date) => new Date(getDayFromDate(date));
