import {
	Button,
	Buttons,
	Content,
	MainColor,
	Message,
	Modal
} from "@ggbot2/design"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { StrategyContext } from "../../contexts/Strategy.js"
import { useUserApi } from "../../hooks/useUserApi.js"
import { href } from "../../routing/user/hrefs.js"
import { StrategyRecord } from "../StrategyRecord.js"

export const DeleteStrategy: FC = () => {
	const color: MainColor = "warning"

	const { formatMessage } = useIntl()

	const { strategy } = useContext(StrategyContext)

	const DELETE = useUserApi.DeleteStrategy()
	const isLoading = DELETE.isPending || DELETE.isDone
	const redirect = DELETE.isDone

	const [modalIsActive, setModalIsActive] = useState(false)

	const toggleModal = useCallback(() => {
		setModalIsActive((active) => !active)
	}, [])

	const onClickConfirmation = useCallback(() => {
		if (strategy)
			DELETE.request({
				strategyId: strategy.id,
				strategyKind: strategy.kind
			})
	}, [DELETE, strategy])

	useEffect(() => {
		if (redirect) window.location.href = href.dashboardPage()
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

						<StrategyRecord strategy={strategy} />
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
