import { Button, Buttons, useToast } from "@ggbot2/design"
import { FC, useCallback } from "react"

export const ToastExample: FC = () => {
	const { toast } = useToast()

	const showError = useCallback(() => {
		toast.danger("Some error occurred")
	}, [toast])

	const showInfo = useCallback(() => {
		toast.info("This is an information message")
	}, [toast])

	const showWarning = useCallback(() => {
		toast.warning("Attention!")
	}, [toast])

	return (
		<Buttons>
			<Button onClick={showInfo}>Show info</Button>

			<Button onClick={showError}>Show error</Button>

			<Button onClick={showWarning}>Show warning</Button>
		</Buttons>
	)
}
