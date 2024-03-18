import { GoSettings } from "_/components/GoSettings"
import {
	Buttons,
	Checkbox,
	Content,
	Message,
	Modal
} from "_/components/library"
import { useSubscription } from "_/hooks/useSubscription"
import { sessionWebStorage } from "_/storages/session"
import {
	ChangeEventHandler,
	FC,
	InputHTMLAttributes,
	useCallback,
	useEffect,
	useState
} from "react"
import { FormattedMessage, useIntl } from "react-intl"

export const PleasePurchase: FC = () => {
	const { formatMessage } = useIntl()

	const { hasActiveSubscription } = useSubscription()

	const [doNotShow, setDoNotShow] = useState<boolean | undefined>()
	const [isActive, setIsActive] = useState(false)

	const onChangeDoNotShow = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(event) => {
			const { checked } =
				event.target as unknown as InputHTMLAttributes<HTMLInputElement>
			setDoNotShow(checked)
			sessionWebStorage.doNotShowPleasePurchase.set(checked)
		},
		[]
	)

	useEffect(() => {
		if (sessionWebStorage.doNotShowPleasePurchase.get()) return
		if (hasActiveSubscription === false) setIsActive(true)
	}, [hasActiveSubscription])

	return (
		<Modal isActive={isActive} setIsActive={setIsActive}>
			<Message
				color="info"
				header={formatMessage({ id: "PleasePurchase.title" })}
			>
				<Content>
					<p>
						<FormattedMessage id="PleasePurchase.message" />
					</p>

					<p>
						<FormattedMessage
							id="PleasePurchase.goToSettings"
							values={{
								b: (chunks) => <b>{chunks}</b>,
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</p>

					<Checkbox checked={doNotShow} onChange={onChangeDoNotShow}>
						<FormattedMessage id="PleasePurchase.doNotShow" />
					</Checkbox>
				</Content>

				<Buttons>
					<GoSettings />
				</Buttons>
			</Message>
		</Modal>
	)
}
