import { Button, Buttons, Content, MainColor, Message, Modal } from '_/components/library'
import { useDeleteBinanceApiConfig } from '_/hooks/user/api'
import { FormattedMessage } from '_/i18n/components'
import { useEffect, useState } from 'react'

export function DeleteBinanceApi({ refetchApiKey }: { refetchApiKey: () => void }) {
	const color: MainColor = 'warning'

	const DELETE = useDeleteBinanceApiConfig()
	const canCloseModal = DELETE.isDone
	const isLoading = DELETE.isPending

	const [modalIsActive, setModalIsActive] = useState(false)

	useEffect(() => {
		if (canCloseModal) {
			setModalIsActive(false)
			refetchApiKey()
		}
	}, [canCloseModal, refetchApiKey])

	return (
		<>
			<Button color={color} onClick={() => setModalIsActive(true)}>
				<FormattedMessage id="DeleteBinanceApi.button" />
			</Button>
			<Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
				<Message
					color={color}
					header={<FormattedMessage id="DeleteBinanceApi.title" />}
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
							onClick={() => {
								if (DELETE.canRun) DELETE.request()
							}}
						>
							<FormattedMessage id="DeleteBinanceApi.confirmation" />
						</Button>
						<Button onClick={() => setModalIsActive(false)}>
							<FormattedMessage id="DeleteBinanceApi.dismiss" />
						</Button>
					</Buttons>
				</Message>
			</Modal>
		</>
	)
}
