import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
} from "react";
import {
  Modal as _Modal,
  ModalProps as _ModalProps,
  ModalBackground,
  ModalClose,
  ModalContent,
} from "trunx";

export type ModalProps = Pick<_ModalProps, "isActive"> & {
  setIsActive: Dispatch<SetStateAction<boolean>>;
};

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  children,
  isActive,
  setIsActive,
}) => {
  const closeModal = useCallback(() => {
    setIsActive(false);
  }, [setIsActive]);

  return (
    <_Modal isActive={isActive}>
      <ModalBackground />

      <ModalContent>{children}</ModalContent>
      <ModalClose size="large" onClick={closeModal} />
    </_Modal>
  );
};
