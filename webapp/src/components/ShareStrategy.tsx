import { Button } from "_/components/library"
import { ToastContext } from "_/contexts/Toast"
import { webapp } from "_/routing/webapp"
import { Strategy, StrategyKey } from "@workspace/models"
import { useContext } from "react"
import { FormattedMessage, useIntl } from "react-intl"

export function ShareStrategy({
	strategyKey, strategyName
}: Partial<{
	strategyKey: StrategyKey
	strategyName: Strategy["name"]
}>) {
	const { formatMessage } = useIntl()
	const { toast } = useContext(ToastContext)
	return (
		<Button
			onClick={() => {
				try {
					const shareData: Pick<
						ShareData, "title" | "text" | "url"
					> | undefined = strategyKey ? {
						title: PROJECT_SHORT_NAME,
						url: webapp.strategy(strategyKey).href,
						text: strategyName
					} : undefined
					if (!shareData) return
					if (
						"share" in navigator && navigator.canShare?.(shareData)
					) navigator.share(shareData).catch((error) => console.debug(error))
					else if (
						"clipboard" in navigator && shareData.url
					) navigator.clipboard.writeText(shareData.url).then(() => {
						toast.info(formatMessage({ id: "ShareStrategy.copied" }))
					}).catch((error) => console.debug(error))
					else toast.warning(formatMessage({ id: "ShareStrategy.error" }))
				} catch (error) {
					console.debug(error)
					toast.warning(formatMessage({ id: "ShareStrategy.error" }))
				}
			}}
		>
			<FormattedMessage id="ShareStrategy.label" />
		</Button>
	)
}
