import { classNames } from "_/classNames"
import { forwardRef } from "react"

export type FlowViewContainerElement = HTMLDivElement | null

export const FlowViewContainer = forwardRef<HTMLDivElement>((_props, ref) => (
	<div ref={ref} className={classNames("FlowViewContainer")} />
))

FlowViewContainer.displayName = "FlowViewContainer"
