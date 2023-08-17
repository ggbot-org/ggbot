import { _classNames, _ClassNamesArg, BulmaClassName } from "@ggbot2/design"

type ClassName = BulmaClassName

export const classNames = (...args: _ClassNamesArg<ClassName>[]) =>
	_classNames(...args)
