import { Dflow, DflowData } from "dflow";

import { DeletionTime, UpdateTime } from "./time.js";

export type OperationInput = DflowData | void;

export type OperationOutput = DflowData | null;

export const isOperationOutput = (arg: unknown) => {
  if (arg === null) return true;
  return Dflow.isDflowData(arg);
};

export type Operation<
  Input extends OperationInput,
  Output extends OperationOutput
> = {
  in: Input;
  out: Output;
  func: (arg: Input) => Promise<Output>;
};

export type ReadOperationOutput<Data extends DflowData> = Data | null;
export type ReadOperation<
  Input extends OperationInput,
  Output extends DflowData
> = Operation<Input, ReadOperationOutput<Output>>;

export type UpdateOperationOutput = UpdateTime;
export type UpdateOperation<Input extends OperationInput> = Operation<
  Input,
  UpdateOperationOutput
>;

export type DeleteOperationOutput = DeletionTime;
export type DeleteOperation<Input extends OperationInput> = Operation<
  Input,
  DeleteOperationOutput
>;
