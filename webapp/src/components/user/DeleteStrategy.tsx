import {
	Button,
	Buttons,
	Content,
	MainColor,
	Message,
	Modal
} from "_/components/library"
import { StrategyRecord } from "_/components/StrategyRecord"
import { useUserApi } from "_/hooks/useUserApi"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { StrategyKey } from "@workspace/models"
import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

// TODO should delete strategy from local storage
type Props = {
	strategyKey: StrategyKey | undefined
}

export function DeleteStrategy({ strategyKey }: Props) {
	const color: MainColor = "warning"

	const { formatMessage } = useIntl()

	const DELETE = useUserApi.DeleteStrategy()
	const isLoading = DELETE.isPending || DELETE.isDone
	const redirect = DELETE.isDone

	const [modalIsActive, setModalIsActive] = useState(false)

	const toggleModal = () => {
		setModalIsActive((active) => !active)
	}

	const onClickConfirmation = () => {
		if (strategyKey) DELETE.request(strategyKey)
	}

	useEffect(() => {
		if (redirect) GOTO(webapp.user.dashboard)
	}, [redirect])

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
