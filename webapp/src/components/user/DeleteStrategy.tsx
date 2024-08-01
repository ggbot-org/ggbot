import {
	Button,
	Buttons,
	Content,
	MainColor,
	Message,
	Modal
} from "_/components/library"
import { StrategyRecord } from "_/components/StrategyRecord"
import { useDeleteStrategy } from "_/hooks/user/api"
import { StrategyKey } from "@workspace/models"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

type Props = {
	strategyKey: StrategyKey | undefined
}

const color: MainColor = "warning"

export function DeleteStrategy({ strategyKey }: Props) {
	const { formatMessage } = useIntl()

	const DELETE = useDeleteStrategy(strategyKey)

	const [modalIsActive, setModalIsActive] = useState(false)

	return (
		<>
			<Button
				color={color}
				onClick={() => {
					setModalIsActive((active) => !active)
				}}
			>
				<FormattedMessage id="DeleteStrategy.button" />
			</Button>

			<Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
				<Message
					header={formatMessage({ id: "DeleteStrategy.title" })}
					color={color}
				>
					<Content>
						<p>
							<FormattedMessage id="DeleteStrategy.message" />
						</p>

						<StrategyRecord strategyKey={strategyKey} />
					</Content>

					<Buttons>
						<Button
							color={color}
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
