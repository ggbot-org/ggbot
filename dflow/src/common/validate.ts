import type { DflowNodesCatalog } from "dflow";
import { ErrorUknownDflowNodes } from "../errors.js";
import { DflowExecutorView } from "./executor.js";

/**
 * Check if provided view is well defined and compatible with nodesCatalog.
 *
 * @throws {ErrorUknownDflowNodes}
 */
export const dflowValidate = (
  nodesCatalog: DflowNodesCatalog,
  view: DflowExecutorView
): void => {
  const viewNodeKinds = view.nodes.map(({ text, type }) => type ?? text);
  const nodeKinds = Object.keys(nodesCatalog);
  // Check for unknown nodes.
  const unknownNodes = viewNodeKinds.filter(
    (kind) => !nodeKinds.includes(kind)
  );
  if (unknownNodes.length) throw new ErrorUknownDflowNodes(unknownNodes);
};
