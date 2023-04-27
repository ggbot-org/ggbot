export const monthNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

/** Month num as returned by `new Date().getMonth()`. */
export type MonthNum = (typeof monthNums)[number];
