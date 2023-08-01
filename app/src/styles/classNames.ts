import {
  ClassName as _ClassName,
  classNames as _classNames,
  ClassNamesArg,
} from "@ggbot2/design";

type FlowViewContainerClassNames = "FlowViewContainer";

type ClassName = _ClassName & FlowViewContainerClassNames;

export const classNames = (...args: ClassNamesArg<ClassName>[]) =>
  _classNames(...args);
