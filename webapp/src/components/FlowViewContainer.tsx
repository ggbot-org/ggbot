import { classnames } from "_/classnames"
import { forwardRef } from "react"

export type FlowViewContainerElement = HTMLDivElement | null

export const FlowViewContainer = forwardRef<HTMLDivElement>((_props, ref) => (
	<div ref={ref} className={classnames("FlowViewContainer")} />
))

FlowViewContainer.displayName = "FlowViewContainer"
