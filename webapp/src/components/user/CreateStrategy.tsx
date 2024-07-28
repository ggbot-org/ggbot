import { classnames } from "_/classnames"
import {
	Button,
	Buttons,
	Columns,
	Message,
	OneColumn
} from "_/components/library"
import { StrategyName } from "_/components/StrategyName"
import { StrategiesErrorExceededQuota } from "_/components/user/StrategiesErrorExceededQuota"
import { UseActionError } from "_/hooks/useAction"
import { useRedirectToNewStrategyPage } from "_/hooks/useRedirectToNewStrategyPage"
import { useUserApi } from "_/hooks/useUserApi"
import { isName } from "@workspace/models"
import {
	ChangeEventHandler,
	FormEventHandler,
	InputHTMLAttributes,
	useCallback,
	useEffect,
	useState
} from "react"
import { FormattedMessage } from "react-intl"

const fieldName = {
	name: "name"
}
const fields = Object.keys(fieldName)

export function CreateStrategy() {
	const CREATE = useUserApi.CreateStrategy()
	const newStrategy = CREATE.data
	const readOnly = CREATE.isPending
	const isLoading = CREATE.isPending || CREATE.isDone

	const [error, setError] = useState<UseActionError>()
	const [canCreate, setCanCreate] = useState(false)

	const color = canCreate ? (error ? "warning" : "primary") : undefined

	const onChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(event) => {
			setCanCreate(
				isName(
					(
						event.target as unknown as InputHTMLAttributes<HTMLInputElement>
					).value
				)
			)
		},
		[]
	)

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(event) => {
			event.preventDefault()
			if (!canCreate) return
			if (!CREATE.canRun) return
			const eventTarget = event.target as EventTarget & {
				[key in (typeof fields)[number]]?: { value: string }
			}
			const name = eventTarget[fieldName.name]?.value
			if (isName(name)) CREATE.request({ kind: "binance", name })
		},
		[CREATE, canCreate]
	)

	useRedirectToNewStrategyPage(newStrategy)

	useEffect(() => {
		if (CREATE.error) {
			setError(CREATE.error)
			CREATE.reset()
		}
	}, [CREATE])

	return (
		<Columns>
			<OneColumn>
				<form className={classnames("box")} onSubmit={onSubmit}>
					{error ? (
						<StrategiesErrorExceededQuota error={error} />
					) : (
						<Message>
							<FormattedMessage
								id="CreateStrategy.chooseName"
								values={{ em: (chunks) => <em>{chunks}</em> }}
							/>
						</Message>
					)}

					<StrategyName
						required
						name={fieldName.name}
						onChange={onChangeName}
						readOnly={readOnly}
					/>

					<Buttons>
						<Button
							bulma={{ "is-light": color !== "primary" }}
							color={color}
							isLoading={isLoading}
							isOutlined={color === "primary"}
						>
							<FormattedMessage id="CreateStrategy.button" />
						</Button>
					</Buttons>
				</form>
			</OneColumn>
		</Columns>
	)
}
