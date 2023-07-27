import {
  ClassName as _ClassName,
  classNames as _classNames,
  ClassNamesArg,
} from "@ggbot2/design";

import { type FlowViewContainerClassNames } from "../components/FlowViewContainer.js";

type ClassName = _ClassName & FlowViewContainerClassNames;

export const classNames = (...args: ClassNamesArg<ClassName>[]) =>
  _classNames(...args);
