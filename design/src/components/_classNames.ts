import { BulmaClassName, classNames, ClassNamesArg } from "trunx";

import { type CalendarClassNames } from "./Calendar.js";
import { type DailyIntervalClassNames } from "./DailyInterval.js";
import { type OutputFieldClassNames } from "./OutputField.js";

export { type ClassNamesArg } from "trunx";

export type ClassName =
  | BulmaClassName
  | CalendarClassNames
  | DailyIntervalClassNames
  | OutputFieldClassNames;

/**
 * CSS class helper.
 *
 * @internal
 */
export const _classNames = (...args: ClassNamesArg<ClassName>[]) =>
  classNames(...args);
