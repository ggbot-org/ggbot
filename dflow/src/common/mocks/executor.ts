import { DflowNodesCatalog, DflowHost } from "dflow";
import { ErrorMissingDflowExecutionReport } from "../../errors.js";
import { DflowCommonContext } from "../context.js";
import {
  DflowCommonExecutorInput,
  DflowCommonExecutorOutput,
  DflowExecutor,
  DflowExecutorView,
} from "../executor.js";
import { dflowValidate } from "../validate.js";
import { nodesCatalog as coreNodesCatalog } from "../nodesCatalog.js";
import { DflowCommonHostMock } from "./host.js";

export class DflowExecutorMock
  implements DflowExecutor<DflowCommonExecutorInput, DflowCommonExecutorOutput>
{
  readonly view: DflowExecutorView;
  nodesCatalog: DflowNodesCatalog;
  constructor({ view }: Pick<DflowExecutorMock, "view">) {
    this.view = view;
    // Use a vanilla DflowHost to get nodesCatalog.
    const dflow = new DflowHost({ nodesCatalog: coreNodesCatalog });
    this.nodesCatalog = dflow.nodesCatalog;
  }
  async prepare() {
    dflowValidate(this.nodesCatalog, this.view);
  }
  async run(context: DflowCommonExecutorInput) {
    const { view } = this;
    const dflow = new DflowCommonHostMock(
      { nodesCatalog: this.nodesCatalog },
      { ...context }
    );
    dflow.load(view);
    dflow.verbose = true;
    await dflow.run();
    const execution = dflow.executionReport;
    if (!execution) throw new ErrorMissingDflowExecutionReport();
    const { memory, memoryChanged } = dflow.context as DflowCommonContext;
    return {
      execution,
      memory,
      memoryChanged,
    };
  }
}
