import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  Modal,
} from "@ggbot2/design";
import { isName } from "@ggbot2/models";
import { FC, useCallback, useContext, useState } from "react";
import { FormattedMessage } from "react-intl";

import { StrategyName } from "../components/StrategyName.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";

const fields = ["name"] as const;
type Field = (typeof fields)[number];
const fieldName = {
  name: "name",
} as const satisfies Record<string, Field>;

export const RenameStrategy: FC = () => {
  const { strategy } = useContext(StrategyContext);

  const [modalIsActive, setModalIsActive] = useState(false);

  const toggleModal = useCallback(() => {
    setModalIsActive((active) => !active);
  }, []);

  const RENAME = useApi.RenameStrategy();
  const isLoading = RENAME.isPending;
  const readOnly = RENAME.isPending;

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      const { name: newName } = formValues(event, fields);
      if (!isName(newName)) return;
      if (RENAME.canRun)
        RENAME.request({
          name: newName,
          strategyId: strategy.id,
          strategyKind: strategy.kind,
        });
    },
    [RENAME, strategy]
  );

  return (
    <>
      <Button onClick={toggleModal}>
        <FormattedMessage id="RenameStrategy.button" />
      </Button>

      <Modal isActive={modalIsActive} setIsActive={setModalIsActive}>
        <Form box onSubmit={onSubmit}>
          <StrategyName required name={fieldName.name} readOnly={readOnly} />

          <Field isGrouped>
            <Control>
              <Button isLoading={isLoading}>
                <FormattedMessage id="RenameStrategy.save" />
              </Button>
            </Control>
          </Field>
        </Form>
      </Modal>
    </>
  );
};
