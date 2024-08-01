import { classnames } from "_/classnames"
import {
	Button,
	Control,
	Field,
	Message,
	Modal,
	Title
} from "_/components/library"
import { StrategyName } from "_/components/StrategyName"
import { useRenameStrategy } from "_/hooks/user/api"
import { useStrategy } from "_/hooks/useStrategy"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { isName } from "@workspace/models"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

const fieldName = {
	name: "name"
}
const fields = Object.keys(fieldName)

export function RenameStrategy() {
	const { strategyKey } = useStrategyKey()
	const { strategyName } = useStrategy(strategyKey)
	const { request, error, isDone, isPending } = useRenameStrategy(strategyKey)

	const [canRename, setCanRename] = useState(false)
	const [modalIsActive, setModalIsActive] = useState(false)

	useEffect(() => {
		if (isDone) setModalIsActive(false)
	}, [isDone])

	return (
		<>
			<Button
				onClick={() => {
					setModalIsActive((active) => !active)
				}}
			>
				<FormattedMessage id="RenameStrategy.button" />
			</Button>

			<Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
				<form
					className={classnames("box")}
					autoComplete="off"
					onSubmit={(event) => {
						event.preventDefault()
						if (!strategyKey) return
						const eventTarget = event.target as EventTarget & {
							[key in (typeof fields)[number]]?: {
								value: unknown
							}
						}
						const newName = eventTarget[fieldName.name]?.value
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
						placeholder={strategyName}
						name={fieldName.name}
						onChange={(event) => {
							setCanRename(isName(event.target.value))
						}}
						readOnly={isPending}
					/>

					<Field isGrouped>
						<Control>
							<Button
								color={
									canRename
										? error
											? "warning"
											: "primary"
										: undefined
								}
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
