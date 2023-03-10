import { FlowViewNodeTextToType } from "flow-view";
import { isInfoNode, isJsonNode } from "./parser/index.js";

export type NodeTextToViewType = FlowViewNodeTextToType;

/** Node kinds to be ignored during execution. */
export const noOpNodeKinds = ["info"];

/** Resolve node view type by its text. */
export const nodeTextToViewType: NodeTextToViewType = (text) => {
  // Run `isJsonNode` before `isInfoNode` to avoid parse JSON twice.
  if (isJsonNode(text)) return "json";
  if (isInfoNode(text)) return "info";
  return undefined;
};

/** Resolve node kind by its text. */
export type NodeTextToDflowKind = (text: string) => string;

/**
 * Resolve common nodes kind.
 * If no match is found, return the input text.
 */
export const commonNodeTextToDflowKind: NodeTextToDflowKind = (text) => {
  const type = nodeTextToViewType(text);
  if (!type) return text;
  if (type === "info") return "info";
  if (type === "json") return "data";
  return text;
};
