export const weekDayNums = [0, 1, 2, 3, 4, 5, 6] as const

/** Week day num as returned by `new Date().getDate()`. */
export type WeekDayNum = (typeof weekDayNums)[number]
