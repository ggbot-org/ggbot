import {
	Button,
	Buttons,
	Content,
	MainColor,
	Message,
	Modal
} from "_/components/library"
import { StrategyRecord } from "_/components/StrategyRecord"
import { useAccountStrategies } from "_/hooks/useAccountStrategies"
import { useUserApi } from "_/hooks/userApi"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { StrategyKey } from "@workspace/models"
import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

type Props = {
	strategyKey: StrategyKey | undefined
}

const color: MainColor = "warning"

export function DeleteStrategy({ strategyKey }: Props) {
	const { formatMessage } = useIntl()

	const { resetAccountStrategies } = useAccountStrategies()

	const DELETE = useUserApi.DeleteStrategy()
	const isLoading = DELETE.isPending || DELETE.isDone
	const { isDone } = DELETE

	const [modalIsActive, setModalIsActive] = useState(false)

	const toggleModal = () => {
		setModalIsActive((active) => !active)
	}

	const onClickConfirmation = () => {
		if (strategyKey) DELETE.request(strategyKey)
	}

	useEffect(() => {
		if (!isDone) return
		resetAccountStrategies()
		GOTO(webapp.user.dashboard)
	}, [isDone, resetAccountStrategies])

	return (
		<>
			<Button color={color} onClick={toggleModal}>
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

						<StrategyRecord />
					</Content>

					<Buttons>
						<Button
							color={color}
							isLoading={isLoading}
							onClick={onClickConfirmation}
						>
							<FormattedMessage id="DeleteStrategy.confirmation" />
						</Button>

						<Button onClick={toggleModal}>
							<FormattedMessage id="DeleteStrategy.dismiss" />
						</Button>
					</Buttons>
				</Message>
			</Modal>
		</>
	)
}
