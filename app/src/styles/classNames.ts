import {
  ClassName as _ClassName,
  classNames as _classNames,
  ClassNamesArg,
} from "@ggbot2/design";

type ClassName = _ClassName;

export const classNames = (...args: ClassNamesArg<ClassName>[]) =>
  _classNames(...args);
