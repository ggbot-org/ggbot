import { FlowViewNodeTextToType } from "flow-view";

export type NodeTextToViewType = FlowViewNodeTextToType;

/** Node kinds to be ignored during execution. */
export const noOpNodeKinds = ["info"];

/** A node is a comment if its text contains spaces, newlines. */
export const isInfoNode = (text: string) =>
  (text.indexOf(" ") > -1 || text.indexOf("\n") > -1) &&
  // A JSON could contain spaces, e.g. '{"message":"hello world"}'
  !isJsonNode(text);

/** A node which text that contains valid JSON is used to store data. */
export const isJsonNode = (text: string) => {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    if (error instanceof SyntaxError) return false;
    throw error;
  }
};

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
