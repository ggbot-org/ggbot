import { BulmaClassName, classNames as _classNames, ClassNamesArg } from "trunx";

export { type ClassNamesArg } from "trunx";

type CalendarClassNames = "calendar" | "calendar__body" | "calendar__head";

export type ClassName = BulmaClassName | CalendarClassNames | "has-text-brand";

export const classNames = (...args: ClassNamesArg<ClassName>[]) => _classNames(...args);
