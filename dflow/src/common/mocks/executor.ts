import type { DflowNodesCatalog } from "dflow";
import { DflowCommonContext } from "../context.js";
import { ErrorMissingDflowExecutionReport } from "../../errors.js";
import {
  DflowCommonExecutorInput,
  DflowCommonExecutorOutput,
  DflowExecutor,
  DflowExecutorView,
} from "../executor.js";
import { nodesCatalog } from "../nodesCatalog.js";
import { commonNodeTextToDflowKind } from "../nodeResolution.js";
import { dflowValidate } from "../validate.js";
import { DflowCommonHostMock } from "./host.js";

export class DflowExecutorMock
  implements DflowExecutor<DflowCommonExecutorInput, DflowCommonExecutorOutput>
{
  readonly view: DflowExecutorView;
  nodesCatalog: DflowNodesCatalog;
  constructor({ view }: Pick<DflowExecutorMock, "view">) {
    this.view = view;
    this.nodesCatalog = nodesCatalog;
  }
  async prepare() {
    dflowValidate({
      nodesCatalog: this.nodesCatalog,
      nodeTextToDflowKind: commonNodeTextToDflowKind,
      view: this.view,
    });
  }
  async run(context: DflowCommonExecutorInput) {
    const { view } = this;
    const dflow = new DflowCommonHostMock(
      { nodesCatalog: this.nodesCatalog },
      context
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
