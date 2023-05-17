import { DflowErrorItemNotFound, DflowHost } from "dflow";

import { DflowExecutorView } from "./executor.js";
import { NodeTextToDflowKind } from "./nodeResolution.js";
import { isInfoNode } from "./nodeTextParser.js";

/**
 * A DflowHost that can load a FlowView graph.
 *
 * @example
 *
 * ```ts
 * import { DflowLoader, load } from "../path/to/loader.js";
 * class MyDflowHost extends DflowHost implements DflowLoader {
 *   load(view: DflowExecutorView): void {
 *     load({
 *       dflow: this,
 *       nodeTextToDflowKind,
 *       view,
 *     });
 *   }
 * }
 * ```
 */
export interface DflowLoader extends DflowHost {
  load(view: DflowExecutorView): void;
}

/**
 * Parse view and load it as a Dflow graph. Unknown nodes and broken connections
 * are ignored.
 */
export const load = ({
  dflow,
  nodeTextToDflowKind,
  view,
}: {
  dflow: DflowLoader;
  nodeTextToDflowKind: NodeTextToDflowKind;
  view: DflowExecutorView;
}) => {
  const nodeKinds = Object.keys(dflow.nodesCatalog);

  // Create nodes.
  for (const { id, ins, outs, text } of view.nodes) {
    if (isInfoNode(text)) continue;

    const type = nodeTextToDflowKind(text);
    switch (type) {
      // If node has type "data", parse text as JSON and create a DflowNode with kind "data".
      case "data": {
        const out = outs?.[0];
        if (!out) {
          // Throw with a custom error; it should not happen if graph is validated.
          throw new Error(`Data node has no out nodeId=${id}`);
        }
        try {
          const data = JSON.parse(text);
          dflow.newNode({ id, kind: type, outputs: [{ id: out.id, data }] });
        } catch (error) {
          if (error instanceof SyntaxError) continue;
          throw error;
        }
        break;
      }

      // By default create a Dflow node with `kind` given by `text`.
      default: {
        if (nodeKinds.includes(text)) {
          const NodeClass = dflow.nodesCatalog[text];
          // Start from inputs and outputs definitions and add them correponding id found in view.
          const inputs = NodeClass.inputs?.map((_, index) => ({
            id: ins?.[index].id,
          }));
          const outputs = NodeClass.outputs?.map((_, index) => ({
            id: outs?.[index].id,
          }));
          dflow.newNode({
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
      dflow.newEdge({ id, source, target });
    } catch (error) {
      // Ignore broken connections, there could be unknown nodes.
      if (error instanceof DflowErrorItemNotFound) {
        console.error(error);
        continue;
      }
      throw error;
    }
  }
};
