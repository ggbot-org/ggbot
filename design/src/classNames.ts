import { BulmaClassName, classNames as _classNames, ClassNamesArg } from "trunx";

export { type ClassNamesArg } from "trunx";

export type ClassName = BulmaClassName | "has-text-brand";

export const classNames = (...args: ClassNamesArg<ClassName>[]) => _classNames(...args);
