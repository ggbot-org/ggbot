import { BulmaClassName, classNames, ClassNamesArg } from "trunx";

import { type CalendarClassNames } from "./Calendar";
import { type DailyIntervalClassNames } from "./DailyInterval";
import { type OutputFieldClassNames } from "./OutputField";

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
