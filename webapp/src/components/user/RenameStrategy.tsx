import {
	Button,
	Control,
	Field,
	Form,
	formValues,
	Message,
	Modal,
	Title
} from "_/components/library"
import { StrategyName } from "_/components/StrategyName"
import { StrategyContext } from "_/contexts/Strategy"
import { ManageStrategyContext } from "_/contexts/user/ManageStrategy"
import { isName } from "@workspace/models"
import {
	ChangeEventHandler,
	FC,
	FormEventHandler,
	InputHTMLAttributes,
	useCallback,
	useContext,
	useEffect,
	useState
} from "react"
import { FormattedMessage } from "react-intl"

const fieldName = {
	name: "name"
}
const fields = Object.keys(fieldName)

export const RenameStrategy: FC = () => {
	const { strategyName } = useContext(StrategyContext)
	const {
		renameIsPending: isPending,
		renameStrategy,
		renameIsDone,
		renameError: error
	} = useContext(ManageStrategyContext)

	const [canCreate, setCanCreate] = useState(false)
	const [modalIsActive, setModalIsActive] = useState(false)

	const color = canCreate ? (error ? "warning" : "primary") : undefined

	const onChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(event) => {
			if (
				isName(
					(
						event.target as unknown as InputHTMLAttributes<HTMLInputElement>
					).value
				)
			)
				setCanCreate(true)
		},
		[]
	)

	const toggleModal = useCallback(() => {
		setModalIsActive((active) => !active)
	}, [])

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(event) => {
			event.preventDefault()
			const { name: newName } = formValues(event, fields)
			if (!isName(newName)) return
			renameStrategy(newName)
		},
		[renameStrategy]
	)

	useEffect(() => {
		if (renameIsDone) setModalIsActive(false)
	}, [renameIsDone])

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
						placeholder={strategyName}
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
