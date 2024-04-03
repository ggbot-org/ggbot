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
import { href } from "_/routing/user/hrefs"
import { StrategyKey } from "@workspace/models"
import { FC, useCallback, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

// TODO should delete strategy from local storage
type Props = {
	strategyKey: StrategyKey | undefined
}

export const DeleteStrategy: FC<Props> = ({ strategyKey }) => {
	const color: MainColor = "warning"

	const { formatMessage } = useIntl()

	const DELETE = useUserApi.DeleteStrategy()
	const isLoading = DELETE.isPending || DELETE.isDone
	const redirect = DELETE.isDone

	const [modalIsActive, setModalIsActive] = useState(false)

	const toggleModal = useCallback(() => {
		setModalIsActive((active) => !active)
	}, [])

	const onClickConfirmation = useCallback(() => {
		if (strategyKey) DELETE.request(strategyKey)
	}, [DELETE, strategyKey])

	useEffect(() => {
		if (redirect) location.href = href.dashboardPage()
	}, [redirect])

	return (
		<>
			<Button isOutlined color={color} onClick={toggleModal}>
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
