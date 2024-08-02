import { classnames } from "_/classnames"
import { PropsWithChildren, useCallback, useEffect } from "react"
import { Div, Modal as _Modal, ModalClose, ModalContent } from "trunx"

type Props = Partial<{
	isActive: boolean
	/**
	 * To prevent user from closing the modal, do not pass `setIsActive` or set
	 * it to `undefined`.
	 */
	setIsActive: (arg: boolean) => void
}>

export function Modal({
	children,
	isActive,
	setIsActive
}: PropsWithChildren<Props>) {
	const userCannotCloseModal = setIsActive === undefined

	const closeModal = useCallback(() => {
		if (userCannotCloseModal) return
		setIsActive(false)
	}, [setIsActive, userCannotCloseModal])

	const onKeydown = useCallback(
		(event: KeyboardEvent) => {
			if (userCannotCloseModal) return
			if (event.code === "Escape") setIsActive(false)
		},
		[setIsActive, userCannotCloseModal]
	)

	useEffect(() => {
		if (userCannotCloseModal) return
		if (isActive) {
			addEventListener("keydown", onKeydown)
		} else {
			removeEventListener("keydown", onKeydown)
		}
		return () => {
			removeEventListener("keydown", onKeydown)
		}
	}, [userCannotCloseModal, isActive, onKeydown])

	// TODO update trunx Modal, then remove div with modal-background class
	// and use isActive prop instead.
	return (
		<_Modal noBackground bulma={{ "is-active": isActive }}>
			<Div bulma="modal-background" onClick={closeModal} />

			<ModalContent className={classnames("modal__content")}>
				{children}
			</ModalContent>

			{
				/* Hide close button if modal cannot be closed. */ userCannotCloseModal ? null : (
					<ModalClose onClick={closeModal} size="large" />
				)
			}
		</_Modal>
	)
}
