import type { StrategyExecution } from "@ggbot2/models";
import { Pill } from "@ggbot2/ui-components";
import { FC, ReactNode, useMemo } from "react";

type Props = {
  log?: Pick<StrategyExecution, "steps" | "status"> | undefined | null;
};

export const StrategyExecutionLog: FC<Props> = ({ log }) => {
  const { steps, status } = useMemo(
    () => log ?? { steps: [], status: "" },
    [log]
  );

  const statusPill = useMemo<ReactNode>(() => {
    if (status === "success") return <Pill color="primary">{status}</Pill>;
    if (status === "failure") return <Pill color="danger">{status}</Pill>;
    return <Pill>{status}</Pill>;
  }, [status]);

  if (!log) return null;

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
