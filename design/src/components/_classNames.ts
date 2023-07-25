import { BulmaClassName, classNames, ClassNamesArg } from "trunx";

import { type CalendarClassNames } from "../components/Calendar.js";
import { type DailyIntervalClassNames } from "../components/DailyInterval.js";
import { type OutputFieldClassNames } from "../components/OutputField.js";
import { type ToastContainerClassNames } from "../components/ToastContainer.js";

export { type ClassNamesArg } from "trunx";

export type ClassName =
  | BulmaClassName
  | CalendarClassNames
  | DailyIntervalClassNames
  | OutputFieldClassNames
  | ToastContainerClassNames;

/**
 * CSS class helper.
 *
 * @internal
 */
export const _classNames = (...args: ClassNamesArg<ClassName>[]) =>
  classNames(...args);
