import { PropsWithChildren, useCallback, useEffect } from 'react'
import {
	Modal as _Modal,
	ModalBackground,
	ModalClose,
	ModalContent,
} from 'trunx'

export function Modal({
	children,
	isActive,
	setIsActive,
}: PropsWithChildren<
	Partial<{
		isActive: boolean
		/**
		 * To prevent user from closing the modal, do not pass `setIsActive` or set it to `undefined`.
		 */
		setIsActive: (arg: boolean) => void
	}>
>) {
	const userCannotCloseModal = setIsActive === undefined

	const closeModal = useCallback(() => {
		if (userCannotCloseModal) return
		setIsActive(false)
	}, [setIsActive, userCannotCloseModal])

	const onKeydown = useCallback(
		(event: KeyboardEvent) => {
			if (userCannotCloseModal) return
			if (event.code === 'Escape') setIsActive(false)
		},
		[setIsActive, userCannotCloseModal]
	)

	useEffect(() => {
		if (userCannotCloseModal) return
		if (isActive) {
			addEventListener('keydown', onKeydown)
		} else {
			removeEventListener('keydown', onKeydown)
		}
		return () => {
			removeEventListener('keydown', onKeydown)
		}
	}, [userCannotCloseModal, isActive, onKeydown])

	if (!isActive) return null

	return (
		<_Modal isActive>
			<ModalBackground onClick={closeModal} />
			<ModalContent>{children}</ModalContent>
			{
				/* Hide close button if modal cannot be closed. */
				userCannotCloseModal ? null : (
					<ModalClose onClick={closeModal} size="large" />
				)
			}
		</_Modal>
	)
}
