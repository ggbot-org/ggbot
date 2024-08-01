import { classnames } from "_/classnames"
import { Button, Input } from "_/components/library"
import { useFlowView } from "_/hooks/useFlowView"
import { useWriteStrategyFlow } from "_/hooks/user/api"
import { useStrategy } from "_/hooks/useStrategy"
import { useStrategyFlow } from "_/hooks/useStrategyFlow"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { StrategyKey } from "@workspace/models"
import { useCallback, useEffect, useRef, useState } from "react"
import { FormattedMessage } from "react-intl"

type Props = {
	strategyKey: StrategyKey | undefined
}

export function FlowEditor({ strategyKey }: Props) {
	const { strategyName } = useStrategy(strategyKey)

	const { strategyFlow } = useStrategyFlow(strategyKey)
	const initialFlowViewGraph = strategyFlow?.view

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
