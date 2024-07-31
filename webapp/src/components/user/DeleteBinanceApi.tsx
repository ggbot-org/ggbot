import {
	Button,
	Buttons,
	Content,
	MainColor,
	Message,
	Modal
} from "_/components/library"
import { useDeleteBinanceApiConfig } from "_/hooks/user/api"
import { useCallback, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

type Props = {
	refetchApiKey: () => void
}

export function DeleteBinanceApi({ refetchApiKey }: Props) {
	const color: MainColor = "warning"

	const { formatMessage } = useIntl()

	const DELETE = useDeleteBinanceApiConfig()
	const canCloseModal = DELETE.isDone
	const isLoading = DELETE.isPending

	const [modalIsActive, setModalIsActive] = useState(false)

	const toggleModal = useCallback(() => {
		setModalIsActive((active) => !active)
	}, [])

	const onClickConfirmation = useCallback(() => {
		if (DELETE.canRun) DELETE.request()
	}, [DELETE])

	useEffect(() => {
		if (canCloseModal) {
			setModalIsActive(false)
			refetchApiKey()
		}
	}, [canCloseModal, refetchApiKey])

	return (
		<>
			<Button isOutlined color={color} onClick={toggleModal}>
				<FormattedMessage id="DeleteBinanceApi.button" />
			</Button>

			<Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
				<Message
					header={formatMessage({ id: "DeleteBinanceApi.title" })}
					color={color}
				>
					<Content>
						<p>
							<FormattedMessage id="DeleteBinanceApi.question" />
						</p>

						<p>
							<FormattedMessage id="DeleteBinanceApi.warning" />
						</p>

						<p>
							<FormattedMessage id="DeleteBinanceApi.info" />
						</p>
					</Content>

					<Buttons>
						<Button
							color={color}
							isLoading={isLoading}
							onClick={onClickConfirmation}
						>
							<FormattedMessage id="DeleteBinanceApi.confirmation" />
						</Button>

						<Button onClick={toggleModal}>
							<FormattedMessage id="DeleteBinanceApi.dismiss" />
						</Button>
					</Buttons>
				</Message>
			</Modal>
		</>
	)
}
