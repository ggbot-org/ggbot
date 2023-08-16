import {
  ClassName as _ClassName,
  classNames as _classNames,
  ClassNamesArg,
} from "@ggbot2/design";

type FlowViewContainerClassName = "FlowViewContainer";

type ClassName = _ClassName | FlowViewContainerClassName;

export const classNames = (...args: ClassNamesArg<ClassName>[]) =>
  _classNames(...args);
