import { FlowViewNodeTextToType } from "flow-view";

export const nodeTextToViewType: FlowViewNodeTextToType = (text) => {
  try {
    JSON.parse(text);
    return "json";
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
  }
  if (text.indexOf(" ") > -1 || text.indexOf("\n") > -1) return "info";
  return undefined;
};
