import { Button } from "_/components/library"
import { ToastContext } from "_/contexts/Toast"
import { webapp } from "_/routing/webapp"
import { logging } from "@workspace/logging"
import { Strategy, StrategyKey } from "@workspace/models"
import { FC, useContext } from "react"
import { FormattedMessage, useIntl } from "react-intl"

const { debug } = logging("ShareStrategy")

export type ShareStrategyProps = Partial<{
	strategyKey: StrategyKey
	strategyName: Strategy["name"]
}>

export const ShareStrategy: FC<ShareStrategyProps> = ({
	strategyKey,
	strategyName
}) => {
	const { formatMessage } = useIntl()
	const { toast } = useContext(ToastContext)

	return (
		<Button
			isOutlined
			color="primary"
			onClick={() => {
				if (!strategyKey) return
				if (!strategyName) return

				try {
					const shareData: Pick<ShareData, "title" | "text" | "url"> =
						{
							title: formatMessage(
								{ id: "BrandName.label" },
								{ name: PROJECT_SHORT_NAME }
							),
							url: webapp.strategy(strategyKey).href,
							text: strategyName
						}

					if (
						"share" in navigator &&
						"canShare" in navigator &&
						navigator.canShare(shareData)
					) {
						navigator.share(shareData).catch(debug)
					} else if ("clipboard" in navigator && shareData.url) {
						navigator.clipboard
							.writeText(shareData.url)
							.then(() => {
								// TODO should show a popup, instead to rely on toast, which is external and does not appear close to the action.
								toast.info(
									formatMessage({
										id: "ShareStrategy.copied"
									})
								)
							})
							.catch(debug)
					} else {
						toast.warning(
							formatMessage({ id: "ShareStrategy.error" })
						)
					}
				} catch (error) {
					debug(error)
					toast.warning(formatMessage({ id: "ShareStrategy.error" }))
				}
			}}
		>
			<FormattedMessage id="ShareStrategy.label" />
		</Button>
	)
}
