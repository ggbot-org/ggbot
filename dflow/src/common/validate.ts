import type { DflowNodesCatalog } from "dflow";
import type { FlowViewSerializableGraph } from "flow-view";
import { ErrorUknownDflowNodes } from "../errors.js";

/**
 * Check if provided view is well defined and compatible with nodesCatalog.
 *
 * @throws ErrorUknownDflowNodes
 */
export const dflowValidate = (
  nodesCatalog: DflowNodesCatalog,
  view: FlowViewSerializableGraph
): void => {
  const viewNodeKinds = view.nodes.map(({ text, type }) => type ?? text);
  const nodeKinds = Object.keys(nodesCatalog);
  const unknownNodes = viewNodeKinds.filter(
    (kind) => !nodeKinds.includes(kind)
  );
  if (unknownNodes.length) throw new ErrorUknownDflowNodes([]);
};
