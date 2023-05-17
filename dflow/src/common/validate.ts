import { coreNodesCatalog, DflowNodesCatalog } from "dflow";

import { ErrorUknownDflowNodes } from "../errors.js";
import { DflowExecutorView } from "./executor.js";
import { NodeTextToDflowKind, noOpNodeKinds } from "./nodeResolution.js";

/**
 * Check if provided `view` is well defined and compatible with `nodesCatalog`.
 *
 * @throws {@link ErrorUknownDflowNodes}
 */
export const dflowValidate = ({
  nodesCatalog,
  nodeTextToDflowKind,
  view,
}: DflowValidateArg): void => {
  const unknownNodes = extractUnknownNodes({
    nodesCatalog,
    nodeTextToDflowKind,
    view,
  });
  if (unknownNodes.length) throw new ErrorUknownDflowNodes(unknownNodes);
};

type DflowValidateArg = {
  nodesCatalog: DflowNodesCatalog;
  view: DflowExecutorView;
  nodeTextToDflowKind: NodeTextToDflowKind;
};

const extractUnknownNodes = ({
  nodesCatalog,
  view,
  nodeTextToDflowKind,
}: DflowValidateArg): { id: string; text: string }[] => {
  const nodeKinds = Object.keys({ ...nodesCatalog, ...coreNodesCatalog });
  const viewNodeKinds = view.nodes.map(({ id, text }) => ({
    id,
    text,
    kind: nodeTextToDflowKind(text),
  }));
  const unknownNodes = viewNodeKinds.filter(
    ({ kind }) => ![...nodeKinds, ...noOpNodeKinds].includes(kind)
  );
  return unknownNodes.map(({ id, text }) => ({
    id,
    text,
  }));
};
