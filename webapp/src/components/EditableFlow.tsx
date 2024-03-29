import { FlowMenu } from "_/components/FlowMenu"
import {
	FlowViewContainer,
	FlowViewContainerElement
} from "_/components/FlowViewContainer"
import { Button } from "_/components/library"
import { StrategyContext } from "_/contexts/Strategy"
import { useFlowView } from "_/hooks/useFlowView"
import { useStrategyFlow } from "_/hooks/useStrategyFlow"
import { useUserApi } from "_/hooks/useUserApi"
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react"
import { FormattedMessage } from "react-intl"

export const EditableFlow: FC = () => {
	const { strategyKey, strategyKind } = useContext(StrategyContext)

	const { flowViewGraph: initialFlowViewGraph } = useStrategyFlow(strategyKey)

	const flowViewContainerRef = useRef<FlowViewContainerElement>(null)

	const { whenUpdatedFlowView, flowViewGraph } = useFlowView({
		container: flowViewContainerRef.current,
		initialFlowViewGraph,
		strategyKind
	})

	const [canSave, setCanSave] = useState(false)

	const WRITE = useUserApi.WriteStrategyFlow()

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
				<Button
					color={canSave ? "primary" : undefined}
					isLoading={WRITE.isPending}
					onClick={onClickSave}
				>
					<FormattedMessage id="EditableFlow.save" />
				</Button>
			</FlowMenu>

			<FlowViewContainer ref={flowViewContainerRef} />
		</>
	)
}
