import { Button, Buttons } from "_/components/library"
import { ToastContext } from "_/contexts/Toast"
import { useCallback, useContext } from "react"

export function ToastExample() {
	const { toast } = useContext(ToastContext)

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
