import { BulmaClassName, classNames, ClassNamesArg } from "trunx";

type DailyIntervalClassNames = "DailyInterval";

type CalendarClassNames =
  | "Calendar"
  | "Calendar__body"
  | "Calendar__head"
  | "Calendar__head-icon"
  | "Calendar__head-text"
  | "Calendar__week-day"
  | "Calendar__cell"
  | "Calendar__cell--selected"
  | "Calendar__cell--disabled";

type ModalClassNames = "Modal__content";

type ToastContainerClassNames = "ToastContainer";

export { type ClassNamesArg } from "trunx";

export type ClassName =
  | BulmaClassName
  | CalendarClassNames
  | DailyIntervalClassNames
  | ModalClassNames
  | ToastContainerClassNames;

/**
 * CSS class helper.
 *
 * @internal
 */
export const _classNames = (...args: ClassNamesArg<ClassName>[]) =>
  classNames(...args);
