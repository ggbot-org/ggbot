import { classnames } from "_/classnames"
import { FormField, FormFieldName } from "_/components/formFields"
import { Button, Buttons, Columns, Div, Message, OneColumn, Section, Title } from "_/components/library"
import { StrategyName } from "_/components/StrategyName"
import { StrategyRecord, StrategyRecordProps } from "_/components/StrategyRecord"
import { StrategiesErrorExceededQuota } from "_/components/user/StrategiesErrorExceededQuota"
import { useCopyStrategy } from "_/hooks/user/api"
import { ApiActionError } from "@workspace/api"
import { isName, StrategyKey } from "@workspace/models"
import { FormEventHandler, useCallback, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

export function CopyStrategy({
	strategyId, strategyKey, strategyName, strategyWhenCreated
}: StrategyRecordProps & {
	strategyKey: StrategyKey | undefined
}) {
	const [error, setError] = useState<ApiActionError | undefined>()
	const [canCreate, setCanCreate] = useState(false)

	const color = canCreate ? (error ? "warning" : "primary") : undefined

	const COPY = useCopyStrategy()

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(event) => {
			event.preventDefault()
			if (!strategyKey) return
			if (!canCreate) return
			if (!COPY.canRun) return
			const eventTarget = event.target as EventTarget & FormField
			const name = eventTarget.name.value
			if (isName(name)) COPY.request({ name, ...strategyKey })
		},
		[COPY, canCreate, strategyKey]
	)

	useEffect(() => {
		if (COPY.error) {
			setError(COPY.error)
			COPY.reset()
		}
	}, [COPY])

	return (
		<Section>
			<Columns >
				<OneColumn>
					<Div bulma="box">
						<Title>
							<FormattedMessage id="CopyStrategy.title" />
						</Title>
						<Message>
							<FormattedMessage id="CopyStrategy.strategyInfo" />
						</Message>
						<StrategyRecord
							strategyId={strategyId}
							strategyName={strategyName}
							strategyWhenCreated={strategyWhenCreated}
						/>
					</Div>
				</OneColumn>
				<OneColumn>
					<form className={classnames("box")} onSubmit={onSubmit}>
						{error ? null : (
							<Message color="info">
								<FormattedMessage id="CopyStrategy.chooseName" />
							</Message>
						)}
						<StrategiesErrorExceededQuota error={error} />
						<StrategyName
							required
							name={"name" satisfies FormFieldName}
							onChange={(event) => setCanCreate(isName(event.target.value))}
							placeholder={strategyName}
							readOnly={COPY.isPending || COPY.isDone}
						/>
						<Buttons>
							<Button
								bulma={{ "is-light": color !== "primary" }}
								color={color}
								isLoading={COPY.isPending || COPY.isDone}
							>
								<FormattedMessage id="CopyStrategy.button" />
							</Button>
						</Buttons>
					</form>
				</OneColumn>
			</Columns>
		</Section>
	)
}
