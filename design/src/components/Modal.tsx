import { FC, PropsWithChildren, useCallback, useEffect } from "react"
import {
	Modal as _Modal,
	ModalBackground,
	ModalClose,
	ModalContent
} from "trunx"

import { classNames } from "../components/classNames.js"

export type ModalProps = Partial<{
	isActive: boolean
	setIsActive: (arg: boolean) => void
}>

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
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
			window.addEventListener("keydown", onKeydown)
		} else {
			window.removeEventListener("keydown", onKeydown)
		}
		return () => {
			window.removeEventListener("keydown", onKeydown)
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
