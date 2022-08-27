import {
  DflowErrorItemNotFound,
  DflowHost,
  DflowHostConstructorArg,
} from "dflow";
import type { FlowViewSerializableGraph } from "flow-view";
import { DflowCommonContext } from "../common/context.js";
import { Binance } from "./executor.js";

/**
 * BinanceDflowHost extends DflowHost adding ggbot2 DflowCommonContext and
 * instances of BinanceClient and BinanceExchange.
 */
export class BinanceDflowHost extends DflowHost {
  constructor(
    arg: DflowHostConstructorArg,
    {
      // DflowCommonContext
      memory,
      // BinanceDflowContext
      binance,
    }: BinanceDflowContext
  ) {
    super(arg);
    this.context.binance = binance;
    this.context.memory = memory;
    this.context.memoryChanged = false;
  }

  /**
   * Parse view and load it as a Dflow graph.
   * Unknown nodes and broken connections are ignored.
   */
  load(view: FlowViewSerializableGraph): void {
    const nodeKinds = Object.keys(this.nodesCatalog);

    // Create nodes.
    for (const { id, ins, outs, text, type } of view.nodes) {
      switch (type) {
        // If node has type "data", parse text as JSON and create a DflowNode with kind "data".
        case "data": {
          const out = outs?.[0];
          if (!out) continue;
          try {
            const data = JSON.parse(text);
            this.newNode({ id, kind: type, outputs: [{ id: out.id, data }] });
          } catch (error) {
            if (error instanceof SyntaxError) continue;
            throw error;
          }
        }

        // By default create a Dflow node with kind given by view text.
        default: {
          if (nodeKinds.includes(text)) {
            const NodeClass = this.nodesCatalog[text];
            // Start from inputs and outputs definitions and them correponding id found in view.
            const inputs = NodeClass.inputs?.map((_, index) => ({
              id: ins?.[index].id,
            }));
            const outputs = NodeClass.outputs?.map((_, index) => ({
              id: outs?.[index].id,
            }));
            this.newNode({
              id,
              kind: text,
              inputs,
              outputs,
            });
          }
        }
      }
    }

    // Connect nodes with edges.
    for (const { id, from: source, to: target } of view.edges) {
      try {
        this.newEdge({ id, source, target });
      } catch (error) {
        // Ignore broken connections, there could be unknown nodes.
        if (error instanceof DflowErrorItemNotFound) continue;
        throw error;
      }
    }
  }
}

export type BinanceDflowContext = DflowCommonContext & {
  binance: Binance;
};
