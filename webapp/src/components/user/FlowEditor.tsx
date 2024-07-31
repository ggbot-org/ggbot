import { classnames } from "_/classnames"
import { StrategyContext } from "_/contexts/Strategy"
import { Button, Input } from "_/components/library"
import { useFlowView } from "_/hooks/useFlowView"
import { useWriteStrategyFlow } from "_/hooks/user/api"
import { useStrategyFlow } from "_/hooks/useStrategyFlow"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { FormattedMessage } from "react-intl"

export function FlowEditor() {
	const { strategyName, strategyKey } = useContext(StrategyContext)

	const initialFlowViewGraph = useStrategyFlow(strategyKey)

	const flowViewContainerRef = useRef<HTMLDivElement | null>(null)

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
			<div className={classnames("FlowEditor__menu")}>
				<div className={classnames("FlowEditor__strategyName")}>
					<Input isStatic defaultValue={strategyName} />
				</div>

				<div className={classnames("FlowEditor__actions")}>
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
						<FormattedMessage id="Button.save" />
					</Button>
				</div>
			</div>

			<div
				ref={flowViewContainerRef}
				className={classnames("FlowEditor__container")}
			/>
		</>
	)
}
