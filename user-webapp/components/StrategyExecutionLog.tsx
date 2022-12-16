import type { StrategyExecution } from "@ggbot2/models";
import { Pill } from "@ggbot2/ui-components";
import { FC, ReactNode, useMemo } from "react";

type Props = Partial<Pick<StrategyExecution, "status" | "steps">>;

export const StrategyExecutionLog: FC<Props> = ({ status, steps }) => {
  const statusPill = useMemo<ReactNode>(() => {
    if (status === "success") return <Pill color="primary">{status}</Pill>;
    if (status === "failure") return <Pill color="danger">{status}</Pill>;
    return <Pill>{status}</Pill>;
  }, [status]);

  if (!steps) return null;

  return (
    <div className="flex flex-col gap-2">
      {statusPill}

      <div>
        {steps.map((step, i) => (
          <div key={i}>
            <div>{i}</div>
            <div>
              <code>{JSON.stringify(step)}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
