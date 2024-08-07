import { classnames } from "_/classnames"
import { FormField, FormFieldName } from "_/components/formFields"
import { Button, Control, Field, Message, Modal, Title } from "_/components/library"
import { StrategyName } from "_/components/StrategyName"
import { useRenameStrategy } from "_/hooks/user/api"
import { isName, StrategyKey } from "@workspace/models"
import { useEffect, useRef, useState } from "react"
import { FormattedMessage } from "react-intl"

export type RenameStrategyProps = {
	strategyKey: StrategyKey | undefined
	strategyName: string
	resetStrategy: () => void
}

export function RenameStrategy({ strategyKey, strategyName, resetStrategy }: RenameStrategyProps) {
	const { request, error, isDone, isPending } = useRenameStrategy(strategyKey)

	const [canRename, setCanRename] = useState(false)
	const [modalIsActive, setModalIsActive] = useState(false)

	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (!isDone) return
		resetStrategy()
		setModalIsActive(false)
		formRef.current?.reset()
	}, [isDone, resetStrategy])

	return (
		<>
			<Button onClick={() => setModalIsActive((active) => !active)}>
				<FormattedMessage id="RenameStrategy.button" />
			</Button>
			<Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
				<form
					ref={formRef}
					autoComplete="off"
					className={classnames("box")}
					onSubmit={(event) => {
						event.preventDefault()
						if (!strategyKey) return
						const eventTarget = event.target as EventTarget & FormField
						const newName = eventTarget.name.value
						if (!isName(newName)) return
						request({ name: newName, ...strategyKey })
					}}
				>
					<Title>
						<FormattedMessage id="RenameStrategy.title" />
					</Title>
					<Message>
						<FormattedMessage id="RenameStrategy.chooseName" />
					</Message>
					<StrategyName
						required
						name={"name" satisfies FormFieldName}
						onChange={(event) => setCanRename(isName(event.target.value))}
						placeholder={strategyName}
						readOnly={isPending}
					/>
					<Field isGrouped>
						<Control>
							<Button
								color={canRename ? error ? "warning" : "primary" : undefined}
								isLoading={isPending}
							>
								<FormattedMessage id="Button.save" />
							</Button>
						</Control>
					</Field>
				</form>
			</Modal>
		</>
	)
}
