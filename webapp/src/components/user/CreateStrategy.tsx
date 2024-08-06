import { classnames } from "_/classnames"
import { Button, Buttons, Columns, Message, OneColumn } from "_/components/library"
import { StrategyName } from "_/components/StrategyName"
import { StrategiesErrorExceededQuota } from "_/components/user/StrategiesErrorExceededQuota"
import { useCreateStrategy } from "_/hooks/user/api"
import { formattedMessageMarkup } from "_/i18n/formattedMessageMarkup"
import { ApiActionError } from "@workspace/api"
import { isName } from "@workspace/models"
import { FormEventHandler, useCallback, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

const fieldName = { name: "name" }
const fields = Object.keys(fieldName)

export function CreateStrategy() {
	const CREATE = useCreateStrategy()
	const readOnly = CREATE.isPending
	const isLoading = CREATE.isPending || CREATE.isDone

	const [error, setError] = useState<ApiActionError | undefined>()
	const [canCreate, setCanCreate] = useState(false)

	const color = canCreate ? (error ? "warning" : "primary") : undefined

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(event) => {
			event.preventDefault()
			if (!canCreate) return
			if (!CREATE.canRun) return
			const eventTarget = event.target as EventTarget & { [key in (typeof fields)[number]]?: { value: string } }
			const name = eventTarget[fieldName.name]?.value
			if (isName(name)) CREATE.request({ kind: "binance", name })
		},
		[CREATE, canCreate]
	)

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
							<FormattedMessage id="CreateStrategy.chooseName" values={formattedMessageMarkup} />
						</Message>
					)}

					<StrategyName
						required
						name={fieldName.name}
						onChange={(event) => setCanCreate(isName((event.target.value)))}
						readOnly={readOnly}
					/>

					<Buttons>
						<Button
							bulma={{ "is-light": color !== "primary" }}
							color={color}
							isLoading={isLoading}
						>
							<FormattedMessage id="CreateStrategy.button" />
						</Button>
					</Buttons>
				</form>
			</OneColumn>
		</Columns>
	)
}
