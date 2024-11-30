import { Classname } from '_/classnames'
import { Button, ReadonlyInput } from '_/components/library'
import { useFlowView, UseFlowViewOutput } from '_/hooks/useFlowView'
import { useWriteStrategyFlow } from '_/hooks/user/api'
import { FormattedMessage } from '_/i18n/components'
import { GOTO } from '_/routing/navigation'
import { webapp } from '_/routing/webapp'
import { StrategyFlow, StrategyKey } from '@workspace/models'
import { useCallback, useEffect, useRef, useState } from 'react'

export function FlowEditor({ setFlowView, strategyKey, strategyName, strategyFlow }: {
	setFlowView: (arg: UseFlowViewOutput) => void
	strategyKey: StrategyKey | undefined
	strategyName: string
	strategyFlow: StrategyFlow | null | undefined
}) {
	const initialFlowViewGraph = strategyFlow?.view

	// TODO solve issue
	// Ref values (the `current` property) may not be accessed during render. (https://react.dev/reference/react/useRef)  react-compiler/react-compiler
	const flowViewContainerRef = useRef<HTMLDivElement | null>(null)

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
		if (whenUpdatedFlowView) {
			setCanSave(true)
			setFlowView({ flowViewGraph, whenUpdatedFlowView })
		}
	}, [flowViewGraph, whenUpdatedFlowView])

	return (
		<>
			<div className={'flow-editor__menu' satisfies Classname}>
				<div className={'flow-editor__strategy-name' satisfies Classname}>
					<ReadonlyInput value={strategyName} />
				</div>
				<div className={'flow-editor__actions' satisfies Classname}>
					<Button
						onClick={() => {
							if (!strategyKey) return
							GOTO(webapp.user.strategy(strategyKey))
						}}
					>
						<FormattedMessage id="Tabs.manage" />
					</Button>
					<Button
						color={canSave ? 'primary' : undefined}
						isLoading={WRITE.isPending}
						onClick={onClickSave}
					>
						<FormattedMessage id="Button.save" />
					</Button>
				</div>
			</div>
			<div
				ref={flowViewContainerRef}
				className={'flow-editor__container' satisfies Classname}
			/>
		</>
	)
}
