import { Button, Buttons, Content, MainColor, Message, Modal } from '_/components/library'
import { StrategyRecord, StrategyRecordProps } from '_/components/StrategyRecord'
import { useDeleteStrategy } from '_/hooks/user/api'
import { StrategyKey } from '@workspace/models'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

export function DeleteStrategy({
	strategyKey,
	...strategyRecordProps
}: StrategyRecordProps & { strategyKey: StrategyKey | undefined }) {
	const DELETE = useDeleteStrategy()

	const [modalIsActive, setModalIsActive] = useState(false)
	const [color, setColor] = useState<Extract<MainColor, 'warning'> | undefined>()

	return (
		<>
			<Button
				color={color}
				onBlur={() => setColor(undefined)}
				onClick={() => setModalIsActive(true)}
				onFocus={() => setColor('warning')}
				onPointerEnter={() => setColor('warning')}
				onPointerLeave={() => setColor(undefined)}
			>
				<FormattedMessage id="DeleteStrategy.button" />
			</Button>
			<Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
				<Message color="warning" header={<FormattedMessage id="DeleteStrategy.title" />} >
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
						<Button onClick={() => setModalIsActive(false)}>
							<FormattedMessage id="DeleteStrategy.dismiss" />
						</Button>
					</Buttons>
				</Message>
			</Modal>
		</>
	)
}
