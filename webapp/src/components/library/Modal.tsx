import { classNames } from "_/classNames"
import { FC, PropsWithChildren, useCallback, useEffect } from "react"
import {
	Modal as _Modal,
	ModalBackground,
	ModalClose,
	ModalContent
} from "trunx"

type Props = Partial<{
	isActive: boolean
	/**
	 * To prevent user from closing the modal, do not pass `setIsActive` or set
	 * it to `undefined`.
	 */
	setIsActive: (arg: boolean) => void
}>

export const Modal: FC<PropsWithChildren<Props>> = ({
	children,
	isActive,
	setIsActive
}) => {
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

	return (
		<_Modal isActive={isActive}>
			<ModalBackground onClick={closeModal} />

			<ModalContent className={classNames("Modal__content")}>
				{children}
			</ModalContent>

			{
				/* Hide close button if modal cannot be closed. */ userCannotCloseModal ? null : (
					<ModalClose onClick={closeModal} />
				)
			}
		</_Modal>
	)
}
