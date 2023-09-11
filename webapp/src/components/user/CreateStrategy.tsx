import {
	Button,
	Buttons,
	Column,
	Columns,
	Form,
	FormOnSubmit,
	formValues,
	InputOnChange,
	Message
} from "_/components/library"
import { StrategyName } from "_/components/StrategyName.js"
import { StrategiesErrorExceededQuota } from "_/components/user/StrategiesErrorExceededQuota.js"
import { UseActionError } from "_/hooks/useAction.js"
import { useRedirectToNewStrategyPage } from "_/hooks/useRedirectToNewStrategyPage.js"
import { useUserApi } from "_/hooks/useUserApi.js"
import { isName } from "@workspace/models"
import { FC, useCallback, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

const fieldName = {
	name: "name"
}
const fields = Object.keys(fieldName)

export const CreateStrategy: FC = () => {
	const CREATE = useUserApi.CreateStrategy()
	const newStrategy = CREATE.data
	const readOnly = CREATE.isPending
	const isLoading = CREATE.isPending || CREATE.isDone

	const [error, setError] = useState<UseActionError>()
	const [canCreate, setCanCreate] = useState(false)

	const color = canCreate ? (error ? "warning" : "primary") : undefined

	const onChangeName = useCallback<InputOnChange>((event) => {
		setCanCreate(isName(event.target.value))
	}, [])

	const onSubmit = useCallback<FormOnSubmit>(
		(event) => {
			event.preventDefault()
			if (!canCreate) return
			if (!CREATE.canRun) return
			const { name } = formValues(event, fields)
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

	useRedirectToNewStrategyPage(newStrategy)

	return (
		<Columns>
			<Column
				size={{
					tablet: "full",
					widescreen: "three-quarters",
					fullhd: "half"
				}}
			>
				<Form box onSubmit={onSubmit}>
					{error ? null : (
						<Message>
							<FormattedMessage
								id="CreateStrategy.chooseName"
								values={{ em: (chunks) => <em>{chunks}</em> }}
							/>
						</Message>
					)}

					<StrategiesErrorExceededQuota error={error} />

					<StrategyName
						required
						name={fieldName.name}
						onChange={onChangeName}
						readOnly={readOnly}
					/>

					<Buttons>
						<Button
							color={color}
							isLight={color !== "primary"}
							isLoading={isLoading}
							isOutlined={color === "primary"}
						>
							<FormattedMessage id="CreateStrategy.button" />
						</Button>
					</Buttons>
				</Form>
			</Column>
		</Columns>
	)
}
