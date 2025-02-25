import { Classname } from '_/classnames'
import {
	Button,
	Buttons,
	InputFieldName,
	Message,
	Modal,
	Title,
} from '_/components/library'
import { useRenameStrategy } from '_/hooks/user/api'
import { FormattedMessage } from '_/i18n/components'
import { isName, StrategyKey } from '@workspace/models'
import { useEffect, useRef, useState } from 'react'

type FormField = {
	name: { value: string }
}
type FormFieldName = keyof FormField

export function RenameStrategy({
	strategyKey,
	strategyName,
	renameStrategy,
}: {
	strategyKey: StrategyKey | undefined
	strategyName: string
	renameStrategy: (name: string) => void
}) {
	const { request, reset, error, isDone, isPending } = useRenameStrategy()

	const [canRename, setCanRename] = useState(false)
	const [newName, setNewName] = useState('')
	const [modalIsActive, setModalIsActive] = useState(false)

	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (!isDone) return
		reset()
		formRef.current?.reset()
		renameStrategy(newName)
		setModalIsActive(false)
	}, [isDone, renameStrategy, reset, newName])

	useEffect(() => {
		if (modalIsActive === false) formRef.current?.reset()
	}, [modalIsActive, formRef])

	if (!strategyKey) return null

	return (
		<>
			<Button onClick={() => setModalIsActive((active) => !active)}>
				<FormattedMessage id="RenameStrategy.button" />
			</Button>
			<Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
				<form
					ref={formRef}
					autoComplete="off"
					className={'box' satisfies Classname}
					onSubmit={(event) => {
						event.preventDefault()
						if (!canRename) return
						const eventTarget = event.target as EventTarget & FormField
						request({ name: eventTarget.name.value, ...strategyKey })
					}}
				>
					<Title>
						<FormattedMessage id="RenameStrategy.title" />
					</Title>
					<Message>
						<FormattedMessage id="RenameStrategy.chooseName" />
					</Message>
					<InputFieldName
						required
						label={<FormattedMessage id="StrategyName.label" />}
						name={'name' satisfies FormFieldName}
						onChange={(event) => {
							const name = event.target.value
							if (isName(name)) {
								setNewName(name)
								setCanRename(true)
							}
						}}
						placeholder={strategyName}
						readOnly={isPending}
					/>
					<Buttons>
						<Button
							color={canRename ? (error ? 'warning' : 'primary') : undefined}
							isLoading={isPending}
						>
							<FormattedMessage id="Button.save" />
						</Button>
						<Button onClick={() => setModalIsActive(false)}>
							<FormattedMessage id="Button.cancel" />
						</Button>
					</Buttons>
				</form>
			</Modal>
		</>
	)
}
