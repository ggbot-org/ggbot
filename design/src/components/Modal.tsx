import { FC, PropsWithChildren, useCallback } from "react";
import {
  Modal as _Modal,
  ModalBackground,
  ModalClose,
  ModalContent,
} from "trunx";

import { _classNames } from "../components/_classNames.js";

export type ModalProps = Partial<{
  isActive: boolean;
  setIsActive: (arg: boolean) => void;
}>;

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

      <ModalContent className={_classNames("Modal__content")}>
        {children}
      </ModalContent>

      {
        /* Hide close button if modal cannot be closed. */ userCannotCloseModal ? null : (
          <ModalClose size="large" onClick={closeModal} />
        )
      }
    </_Modal>
  );
};
