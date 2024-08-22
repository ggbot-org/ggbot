import { classnames } from "_/classnames"
import { Button, ReadonlyInput } from "_/components/library"
import { useFlowView } from "_/hooks/useFlowView"
import { useWriteStrategyFlow } from "_/hooks/user/api"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { StrategyFlow, StrategyKey } from "@workspace/models"
import { useCallback, useEffect, useRef, useState } from "react"
import { FormattedMessage } from "react-intl"

export function FlowEditor({ strategyKey, strategyName, strategyFlow }: {
	strategyKey: StrategyKey | undefined
	strategyName: string
	strategyFlow: StrategyFlow | null | undefined
}) {
	const initialFlowViewGraph = strategyFlow?.view

	const flowViewContainerRef = useRef<HTMLDivElement | null>(null)

	// TODO solve issue
	// Ref values (the `current` property) may not be accessed during render. (https://react.dev/reference/react/useRef)  react-compiler/react-compiler
	// eslint-disable-next-line
	const { whenUpdatedFlowView, flowViewGraph } = useFlowView(flowViewContainerRef.current, initialFlowViewGraph, strategyKey?.strategyKind)

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
			<div className={classnames("flow-editor__menu")}>
				<div className={classnames("flow-editor__strategy-name")}>
					<ReadonlyInput value={strategyName} />
				</div>
				<div className={classnames("flow-editor__actions")}>
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
				className={classnames("flow-editor__container")}
			/>
		</>
	)
}
