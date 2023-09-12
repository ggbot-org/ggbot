import {
	Box,
	Button,
	Buttons,
	Column,
	Columns,
	Form,
	FormOnSubmit,
	formValues,
	InputOnChange,
	Message,
	Section,
	Title
} from "_/components/library"
import { StrategyName } from "_/components/StrategyName.js"
import { StrategyRecord } from "_/components/StrategyRecord.js"
import { StrategiesErrorExceededQuota } from "_/components/user/StrategiesErrorExceededQuota.js"
import { StrategyContext } from "_/contexts/Strategy.js"
import { UseActionError } from "_/hooks/useAction.js"
import { useRedirectToNewStrategyPage } from "_/hooks/useRedirectToNewStrategyPage.js"
import { useUserApi } from "_/hooks/useUserApi.js"
import { isName } from "@workspace/models"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

const fieldName = {
	name: "name"
}
const fields = Object.keys(fieldName)

export const CopyStrategy: FC = () => {
	const { strategy } = useContext(StrategyContext)

	const [error, setError] = useState<UseActionError>()
	const [canCreate, setCanCreate] = useState(false)

	const color = canCreate ? (error ? "warning" : "primary") : undefined

	const COPY = useUserApi.CopyStrategy()
	const readOnly = COPY.isPending || COPY.isDone
	const isLoading = COPY.isPending || COPY.isDone
	const newStrategy = COPY.data

	const onChangeName = useCallback<InputOnChange>((event) => {
		setCanCreate(isName(event.target.value))
	}, [])

	const onSubmit = useCallback<FormOnSubmit>(
		(event) => {
			event.preventDefault()
			if (!canCreate) return
			if (!COPY.canRun) return
			const { name } = formValues(event, fields)
			if (isName(name))
				COPY.request({
					name,
					strategyId: strategy.id,
					strategyKind: strategy.kind
				})
		},
		[COPY, canCreate, strategy]
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
					size={{
						tablet: "full",
						desktop: "three-quarters",
						fullhd: "half"
					}}
				>
					<Box>
						<Title>
							<FormattedMessage id="CopyStrategy.title" />
						</Title>

						<Message>
							<FormattedMessage id="CopyStrategy.strategyInfo" />
						</Message>

						<StrategyRecord />
					</Box>
				</Column>

				<Column
					size={{
						tablet: "full",
						desktop: "three-quarters",
						fullhd: "half"
					}}
				>
					<Form box onSubmit={onSubmit}>
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
							placeholder={strategy.name}
							readOnly={readOnly}
						/>

						<Buttons>
							<Button
								color={color}
								isLight={color !== "primary"}
								isLoading={isLoading}
								isOutlined={color === "primary"}
							>
								<FormattedMessage id="CopyStrategy.button" />
							</Button>
						</Buttons>
					</Form>
				</Column>
			</Columns>
		</Section>
	)
}
