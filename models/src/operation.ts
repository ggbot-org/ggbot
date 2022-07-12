import { DataValue } from "./data.js";

export type Operation<
  Input extends DataValue | void,
  Output extends DataValue
> = {
  input: Input;
  output: Output;
  resolver: (_: Input) => Promise<Output>;
};
