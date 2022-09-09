import { FlowViewNodeTextToType } from "flow-view";

export const nodeTextToViewType: FlowViewNodeTextToType = (text) => {
  if (text.indexOf(" ") > -1 || text.indexOf("\n") > -1) return "info";
  return undefined;
};
