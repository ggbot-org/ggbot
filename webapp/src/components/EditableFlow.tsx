import { FlowMenu } from "_/components/FlowMenu"
import { FlowViewContainer } from "_/components/FlowViewContainer"
import { Button, ButtonOnClick } from "_/components/library"
import { StrategyContext } from "_/contexts/Strategy"
import { StrategyFlowContext } from "_/contexts/StrategyFlow"
import { useUserApi } from "_/hooks/useUserApi"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

export const EditableFlow: FC = () => {
	const { flowViewContainerRef, flowViewGraph, whenUpdatedFlowView } =
		useContext(StrategyFlowContext)
	const { strategy } = useContext(StrategyContext)

	const [canSave, setCanSave] = useState(false)

	const WRITE = useUserApi.WriteStrategyFlow()

	const saveIsPending = WRITE.isPending

	const onClickSave = useCallback<ButtonOnClick>(() => {
		if (!strategy) return
		if (!canSave) return
		if (!WRITE.canRun) return
		if (!flowViewGraph) return
		WRITE.request({
			strategyId: strategy.id,
			strategyKind: strategy.kind,
			view: flowViewGraph
		})
	}, [WRITE, canSave, strategy, flowViewGraph])

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
					isLoading={saveIsPending}
					onClick={onClickSave}
				>
					<FormattedMessage id="EditableFlow.save" />
				</Button>
			</FlowMenu>

			<FlowViewContainer ref={flowViewContainerRef} />
		</>
	)
}
