import type { DflowNodesCatalog } from "dflow";
import type { FlowViewSerializableGraph } from "flow-view";
import { ErrorUknownDflowNodes } from "../errors.js";

/**
 * Check if provided view is well defined and compatible with nodesCatalog.
 *
 * @throws ErrorUknownDflowNodes
 */
export const dflowValidate = (
  _nodesCatalog: DflowNodesCatalog,
  _view: FlowViewSerializableGraph
): void => {
  throw new ErrorUknownDflowNodes([]);
};
