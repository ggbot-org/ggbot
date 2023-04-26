import { forwardRef } from "react";

export const FlowViewContainer = forwardRef<HTMLDivElement>((_props, ref) => <div ref={ref} style={{ height: "800px" }} />);

FlowViewContainer.displayName = "FlowViewContainer";
