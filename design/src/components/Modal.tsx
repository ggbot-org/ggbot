import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
} from "react";
import {
  Modal as _Modal,
  ModalBackground,
  ModalClose,
  ModalContent,
  ModalProps as _ModalProps,
} from "trunx";

export type ModalProps = Pick<_ModalProps, "isActive"> & {
  setIsActive?: Dispatch<SetStateAction<boolean>> | undefined;
};

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  children,
  isActive,
  setIsActive,
}) => {
  const userCannotCloseModal = setIsActive === undefined;

  const closeModal = useCallback(() => {
    if (userCannotCloseModal) return;
    setIsActive(false);
  }, [setIsActive, userCannotCloseModal]);

  return (
    <_Modal isActive={isActive}>
      <ModalBackground />

      <ModalContent>{children}</ModalContent>

      {
        /* Hide close button if modal cannot be closed. */ userCannotCloseModal ? null : (
          <ModalClose size="large" onClick={closeModal} />
        )
      }
    </_Modal>
  );
};
