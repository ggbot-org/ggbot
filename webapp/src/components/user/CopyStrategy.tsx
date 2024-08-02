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
import { useCopyStrategy } from "_/hooks/user/api"
import { useStrategy } from "_/hooks/useStrategy"
import { ApiActionError } from "@workspace/api"
import { isName, StrategyKey } from "@workspace/models"
import { FormEventHandler, useCallback, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

const fieldName = {
	name: "name"
}
const fields = Object.keys(fieldName)

type Props = {
	strategyKey: StrategyKey | undefined
}

export function CopyStrategy({ strategyKey }: Props) {
	const { strategyName } = useStrategy(strategyKey)

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
			const eventTarget = event.target as EventTarget & {
				[key in (typeof fields)[number]]?: { value: string }
			}
			const name = eventTarget[fieldName.name]?.value
			if (isName(name)) COPY.request({
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

						<StrategyRecord strategyKey={strategyKey} />
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
							onChange={(event) => {
								setCanCreate(isName(event.target.value))
							}}
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
				</Column>
			</Columns>
		</Section>
	)
}
