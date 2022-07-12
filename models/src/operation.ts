import { DataValue } from "./data";

export type Operation<Input extends DataValue, Output extends DataValue> = {
  input: Input;
  output: Output;
  resolver: (_: Input) => Promise<Output>;
};
