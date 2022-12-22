import type { StrategyExecution } from "@ggbot2/models";
import type { StrategyExecution } from "@ggbot2/dflow";
import { Pill } from "@ggbot2/ui-components";
import { FC, ReactNode, useMemo } from "react";

type Props = Partial<Pick<StrategyExecution, "status" | "steps">>;

export const StrategyExecutionLog: FC<Props> = ({ status, steps }) => {
  const statusPill = useMemo<ReactNode>(() => {
    if (status === "success") return <Pill color="primary">{status}</Pill>;
    if (status === "failure") return <Pill color="danger">{status}</Pill>;
    return null;
  }, [status]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <span>Execution</span>
        <div>{statusPill}</div>
      </div>

      <div className="flex flex-col gap-2">
        {steps?.map((step, i) => {
          const kind = step.k;
          const firstOutput = step.o?.[0].d;
          const showPreview = [
            "data",
            "add",
            "if",
            "div",
            "sub",
            "mul",
            "<",
            ">",
          ].includes(kind);
          const preview = showPreview ? String(firstOutput) : "";

          return (
            <details key={i} className="cursor-default flex flex-col gap-1">
              <summary className="flex gap-2">
                <span className="text-gray-500 w-8">{i}</span>
                <span className={showPreview ? undefined : "cursor-pointer"}>
                  {kind}
                </span>
                {showPreview && <span>{preview}</span>}
              </summary>
              {showPreview ? null : (
                <div>
                  <pre>
                    <code>{JSON.stringify(step, null, 2)}</code>
                  </pre>
                </div>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
};
