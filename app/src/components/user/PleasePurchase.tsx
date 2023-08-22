import {
	Buttons,
	Checkbox,
	CheckboxOnChange,
	Content,
	Message,
	Modal
} from "@ggbot2/design"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { SubscriptionContext } from "../../contexts/user/Subscription.js"
import { sessionWebStorage } from "../../storages/session.js"
import { GoSettings } from "../GoSettings.js"

export const PleasePurchase: FC = () => {
	const { formatMessage } = useIntl()

	const { hasActiveSubscription } = useContext(SubscriptionContext)

	const [doNotShow, setDoNotShow] = useState(false)
	const [isActive, setIsActive] = useState(false)

	const onChangeDoNotShow = useCallback<CheckboxOnChange>((event) => {
		const checked = event.target.checked
		setDoNotShow(checked)
		sessionWebStorage.doNotShowPleasePurchase.set(checked)
	}, [])

	useEffect(() => {
		if (sessionWebStorage.doNotShowPleasePurchase) return
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
					<GoSettings settingsPage="billing" />
				</Buttons>
			</Message>
		</Modal>
	)
}
