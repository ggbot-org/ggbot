import { BulmaClassName, classNames as _classNames, ClassNamesArg } from "trunx";

type ClassName = BulmaClassName | "has-text-brand";

export const classNames = (...args: ClassNamesArg<ClassName>[]) => _classNames<ClassName>(...args);
