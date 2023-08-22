import { forwardRef } from "react"

import { classNames } from "../styles/classNames.js"

export type FlowViewContainerElement = HTMLDivElement | null

// TODO add typing to flow-view to extends JSX intrinsic elements
// and try to use it here with <flow-view dark>
// consider using only dark scheme
// observe dark and light attributes in flow-view
export const FlowViewContainer = forwardRef<HTMLDivElement>((_props, ref) => (
	<div ref={ref} className={classNames("FlowViewContainer")} />
))

FlowViewContainer.displayName = "FlowViewContainer"
