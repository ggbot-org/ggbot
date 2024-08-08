import { classnames } from "_/classnames"
import { FormField, FormFieldName } from "_/components/formFields"
import { Button, Buttons, InputFieldName, Message, OneColumn } from "_/components/library"
import { StrategiesErrorExceededQuota } from "_/components/user/StrategiesErrorExceededQuota"
import { useCreateStrategy } from "_/hooks/user/api"
import { formattedMessageMarkup } from "_/i18n/formattedMessageMarkup"
import { ApiActionError } from "@workspace/api"
import { isName } from "@workspace/models"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

export function CreateStrategy() {
	const CREATE = useCreateStrategy()
	const readOnly = CREATE.isPending
	const isLoading = CREATE.isPending || CREATE.isDone

	const [error, setError] = useState<ApiActionError | undefined>()
	const [canCreate, setCanCreate] = useState(false)

	const color = canCreate ? (error ? "warning" : "primary") : undefined

	useEffect(() => {
		if (CREATE.error) {
			setError(CREATE.error)
			CREATE.reset()
		}
	}, [CREATE])

	return (
		<OneColumn>
			<form
				className={classnames("box")}
				onSubmit={(event) => {
					event.preventDefault()
					if (!canCreate) return
					if (!CREATE.canRun) return
					const eventTarget = event.target as EventTarget & FormField
					const name = eventTarget.name.value
					if (isName(name)) CREATE.request({ kind: "binance", name })
				}}
			>
				{error ? (
					<StrategiesErrorExceededQuota error={error} />
				) : (
					<Message>
						<FormattedMessage id="CreateStrategy.chooseName" values={formattedMessageMarkup} />
					</Message>
				)}
				<InputFieldName
					required
					label={<FormattedMessage id="StrategyName.label" />}
					name={"name" satisfies FormFieldName}
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
	)
}
