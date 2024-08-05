import { Button, Buttons } from "_/components/library"
import { ToastContext } from "_/contexts/Toast"
import { useContext } from "react"

export function ToastExample() {
	const { toast } = useContext(ToastContext)
	return (
		<Buttons>
			<Button onClick={() => toast.info("This is an information message")}>Show info</Button>

			<Button onClick={() => toast.danger("Some error occurred")}>Show error</Button>

			<Button onClick={() => toast.warning("Attention!")}>Show warning</Button>
		</Buttons>
	)
}
