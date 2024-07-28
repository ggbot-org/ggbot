import { classnames } from "_/classnames"
import {
	Button,
	Buttons,
	Column,
	Columns,
	Div,
	Message,
	Section,
	Title
} from "_/components/library"
import { StrategyName } from "_/components/StrategyName"
import { StrategyRecord } from "_/components/StrategyRecord"
import { StrategiesErrorExceededQuota } from "_/components/user/StrategiesErrorExceededQuota"
import { StrategyContext } from "_/contexts/Strategy"
import { UseActionError } from "_/hooks/useAction"
import { useRedirectToNewStrategyPage } from "_/hooks/useRedirectToNewStrategyPage"
import { useUserApi } from "_/hooks/useUserApi"
import { isName } from "@workspace/models"
import {
	ChangeEventHandler,
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

export function CopyStrategy() {
	const { strategyKey, strategyName } = useContext(StrategyContext)

	const [error, setError] = useState<UseActionError>()
	const [canCreate, setCanCreate] = useState(false)

	const color = canCreate ? (error ? "warning" : "primary") : undefined

	const COPY = useUserApi.CopyStrategy()
	const readOnly = COPY.isPending || COPY.isDone
	const isLoading = COPY.isPending || COPY.isDone
	const newStrategy = COPY.data

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
			if (!strategyKey) return
			if (!canCreate) return
			if (!COPY.canRun) return
			const eventTarget = event.target as EventTarget & {
				[key in (typeof fields)[number]]?: { value: string }
			}
			const name = eventTarget[fieldName.name]?.value
			if (isName(name))
				COPY.request({
					name,
					...strategyKey
				})
		},
		[COPY, canCreate, strategyKey]
	)

	useEffect(() => {
		if (COPY.error) {
			setError(COPY.error)
			COPY.reset()
		}
	}, [COPY])

	useRedirectToNewStrategyPage(newStrategy)

	return (
		<Section>
			<Columns isMultiline>
				<Column
					bulma={[
						"is-full-tablet",
						"is-three-quarters-desktop",
						"is-half-fullhd"
					]}
				>
					<Div bulma="box">
						<Title>
							<FormattedMessage id="CopyStrategy.title" />
						</Title>

						<Message>
							<FormattedMessage id="CopyStrategy.strategyInfo" />
						</Message>

						<StrategyRecord />
					</Div>
				</Column>

				<Column
					bulma={[
						"is-full-tablet",
						"is-three-quarters-desktop",
						"is-half-fullhd"
					]}
				>
					<form className={classnames("box")} onSubmit={onSubmit}>
						{error ? null : (
							<Message color="info">
								<FormattedMessage id="CopyStrategy.chooseName" />
							</Message>
						)}

						<StrategiesErrorExceededQuota error={error} />

						<StrategyName
							required
							name={fieldName.name}
							onChange={onChangeName}
							placeholder={strategyName}
							readOnly={readOnly}
						/>

						<Buttons>
							<Button
								bulma={{ "is-light": color !== "primary" }}
								color={color}
								isLoading={isLoading}
								isOutlined={color === "primary"}
							>
								<FormattedMessage id="CopyStrategy.button" />
							</Button>
						</Buttons>
					</form>
				</Column>
			</Columns>
		</Section>
	)
}
