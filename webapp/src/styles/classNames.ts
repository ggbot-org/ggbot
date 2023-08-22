import { _classNames, _ClassNamesArg, BulmaClassName } from "@ggbot2/design"

type FlowViewContainerClassName = "FlowViewContainer"

type ClassName = BulmaClassName | FlowViewContainerClassName

export const classNames = (...args: _ClassNamesArg<ClassName>[]) =>
	_classNames(...args)
