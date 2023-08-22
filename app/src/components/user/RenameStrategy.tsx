import {
	Button,
	Control,
	Field,
	Form,
	FormOnSubmit,
	formValues,
	InputOnChange,
	Message,
	Modal,
	Title
} from "@ggbot2/design"
import { isName } from "@ggbot2/models"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

import { StrategyContext } from "../../contexts/user/Strategy.js"
import { UseActionError } from "../../hooks/useAction.js"
import { useUserApi } from "../../hooks/useUserApi.js"
import { StrategyName } from "../StrategyName.js"

const fieldName = {
	name: "name"
}
const fields = Object.keys(fieldName)

export const RenameStrategy: FC = () => {
	const { strategy, updateStrategyName } = useContext(StrategyContext)

	const [error, setError] = useState<UseActionError>()
	const [canCreate, setCanCreate] = useState(false)
	const [name, setName] = useState("")
	const [modalIsActive, setModalIsActive] = useState(false)

	const color = canCreate ? (error ? "warning" : "primary") : undefined

	const onChangeName = useCallback<InputOnChange>((event) => {
		const value = event.target.value
		const canCreate = isName(value)
		if (canCreate) {
			setCanCreate(true)
			setName(value)
		}
	}, [])

	const toggleModal = useCallback(() => {
		setModalIsActive((active) => !active)
	}, [])

	const RENAME = useUserApi.RenameStrategy()
	const isPending = RENAME.isPending

	const onSubmit = useCallback<FormOnSubmit>(
		(event) => {
			event.preventDefault()
			const { name: newName } = formValues(event, fields)
			if (!isName(newName)) return
			if (RENAME.canRun)
				RENAME.request({
					name: newName,
					strategyId: strategy.id,
					strategyKind: strategy.kind
				})
		},
		[RENAME, strategy]
	)

	useEffect(() => {
		if (RENAME.error) {
			setError(RENAME.error)
			RENAME.reset()
		}
	}, [RENAME])

	useEffect(() => {
		if (RENAME.isDone) {
			RENAME.reset()
			updateStrategyName(name)
			setModalIsActive(false)
		}
	}, [RENAME, updateStrategyName, name])

	return (
		<>
			<Button onClick={toggleModal}>
				<FormattedMessage id="RenameStrategy.button" />
			</Button>

			<Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
				<Form box autoComplete="off" onSubmit={onSubmit}>
					<Title>
						<FormattedMessage id="RenameStrategy.title" />
					</Title>

					<Message>
						<FormattedMessage id="RenameStrategy.chooseName" />
					</Message>

					<StrategyName
						required
						placeholder={strategy.name}
						name={fieldName.name}
						onChange={onChangeName}
						readOnly={isPending}
					/>

					<Field isGrouped>
						<Control>
							<Button
								color={color}
								isLight={color !== "primary"}
								isLoading={isPending}
								isOutlined={color === "primary"}
							>
								<FormattedMessage id="RenameStrategy.save" />
							</Button>
						</Control>
					</Field>
				</Form>
			</Modal>
		</>
	)
}
