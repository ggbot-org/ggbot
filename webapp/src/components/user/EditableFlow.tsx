import { FlowMenu } from "_/components/FlowMenu"
import {
	FlowViewContainer,
	FlowViewContainerElement
} from "_/components/FlowViewContainer"
import { Button, Buttons } from "_/components/library"
import { useFlowView } from "_/hooks/useFlowView"
import { useWriteStrategyFlow } from "_/hooks/user/api"
import { useStrategyFlow } from "_/hooks/useStrategyFlow"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { useCallback, useEffect, useRef, useState } from "react"
import { FormattedMessage } from "react-intl"

export function EditableFlow() {
	const strategyKey = useStrategyKey()

	const initialFlowViewGraph = useStrategyFlow(strategyKey)

	const flowViewContainerRef = useRef<FlowViewContainerElement>(null)

	const { whenUpdatedFlowView, flowViewGraph } = useFlowView({
		container: flowViewContainerRef.current,
		initialFlowViewGraph,
		strategyKind: strategyKey?.strategyKind
	})

	const [canSave, setCanSave] = useState(false)

	const WRITE = useWriteStrategyFlow()

	const onClickSave = useCallback(() => {
		if (!strategyKey) return
		if (!canSave) return
		if (!WRITE.canRun) return
		if (!flowViewGraph) return
		WRITE.request({
			...strategyKey,
			view: flowViewGraph
		})
	}, [WRITE, canSave, flowViewGraph, strategyKey])

	useEffect(() => {
		if (WRITE.isDone) {
			WRITE.reset()
			setCanSave(false)
		}
	}, [WRITE])

	useEffect(() => {
		if (whenUpdatedFlowView) setCanSave(true)
	}, [whenUpdatedFlowView])

	return (
		<>
			<FlowMenu>
				<Buttons>
					<Button
						onClick={() => {
							if (!strategyKey) return
							GOTO(webapp.user.strategy(strategyKey))
						}}
					>
						<FormattedMessage id="Tabs.manage" />
					</Button>

					<Button
						color={canSave ? "primary" : undefined}
						isLoading={WRITE.isPending}
						onClick={onClickSave}
					>
						<FormattedMessage id="EditableFlow.save" />
					</Button>
				</Buttons>
			</FlowMenu>

			<FlowViewContainer ref={flowViewContainerRef} />
		</>
	)
}
