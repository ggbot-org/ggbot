import type { DflowNodesCatalog } from "dflow";
import { DflowCommonContext } from "../context.js";
import {
  DflowCommonExecutorContext,
  DflowCommonExecutorOutput,
  DflowExecutor,
  DflowExecutorView,
} from "../executor.js";
import { nodesCatalog } from "../nodesCatalog.js";
import { DflowCommonHostMock } from "./host.js";

export class DflowExecutorMock
  implements
    DflowExecutor<DflowCommonExecutorContext, DflowCommonExecutorOutput>
{
  readonly view: DflowExecutorView;
  nodesCatalog: DflowNodesCatalog;
  constructor({ view }: Pick<DflowExecutorMock, "view">) {
    this.view = view;
    this.nodesCatalog = nodesCatalog;
  }
  async run(context: DflowCommonExecutorContext) {
    const { view } = this;
    const dflow = new DflowCommonHostMock(
      { nodesCatalog: this.nodesCatalog },
      context
    );
    dflow.load(view);
    await dflow.run();
    const execution = dflow.executionReport;
    const { memory, memoryChanged } = dflow.context as DflowCommonContext;
    return {
      execution,
      memory,
      memoryChanged,
    };
  }
}
