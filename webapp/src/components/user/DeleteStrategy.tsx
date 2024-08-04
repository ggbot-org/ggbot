import { Button, Buttons, Content, MainColor, Message, Modal } from "_/components/library"
import { StrategyRecord, StrategyRecordProps } from "_/components/StrategyRecord"
import { useDeleteStrategy } from "_/hooks/user/api"
import { StrategyKey } from "@workspace/models"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

type Props = {
	strategyKey: StrategyKey | undefined
} & StrategyRecordProps

export function DeleteStrategy({ strategyKey, ...strategyRecordProps }: Props) {
	const { formatMessage } = useIntl()

	const DELETE = useDeleteStrategy(strategyKey)

	const [modalIsActive, setModalIsActive] = useState(false)
	const [color, setColor] = useState<Extract<MainColor, "warning">|undefined>()

	return (
		<>
			<Button
				color={color}
				onClick={() => setModalIsActive((active) => !active)}
				onFocus={() => setColor("warning")}
				onBlur={() => setColor(undefined)}
				onPointerEnter={() => setColor("warning")}
				onPointerLeave={() => setColor(undefined)}
			>
				<FormattedMessage id="DeleteStrategy.button" />
			</Button>

			<Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
				<Message
					header={formatMessage({ id: "DeleteStrategy.title" })}
					color="warning"
				>
					<Content>
						<p>
							<FormattedMessage id="DeleteStrategy.message" />
						</p>

						<StrategyRecord {...strategyRecordProps} />
					</Content>

					<Buttons>
						<Button
							color="warning"
							disabled={DELETE.isDone}
							isLoading={DELETE.isPending}
							onClick={() => {
								if (strategyKey) DELETE.request(strategyKey)
							}}
						>
							<FormattedMessage id="DeleteStrategy.confirmation" />
						</Button>

						<Button
							onClick={() => {
								setModalIsActive((active) => !active)
							}}
						>
							<FormattedMessage id="DeleteStrategy.dismiss" />
						</Button>
					</Buttons>
				</Message>
			</Modal>
		</>
	)
}
