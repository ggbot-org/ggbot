import { DateTime, Tag } from "@ggbot2/design";
import { StrategyExecution } from "@ggbot2/models";
import { FC, ReactNode, useMemo } from "react";

type Props = Partial<Pick<StrategyExecution, "status" | "steps" | "whenUpdated">>;

export const StrategyExecutionLog: FC<Props> = ({ status, steps, whenUpdated }) => {
  const statusTag = useMemo<ReactNode>(() => {
    if (status === "success") return <Tag color="primary">{status}</Tag>;
    if (status === "failure") return <Tag color="danger">{status}</Tag>;
    return null;
  }, [status]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <span className="text-lg">Execution</span>
        <div>{statusTag}</div>
      </div>

      <div>
        <DateTime format="time" value={whenUpdated} />
      </div>

      <div className="flex flex-col gap-3">
        {steps?.map((step, i) => {
          const kind = step.k;
          const numOutputs = step.o?.length ?? 0;
          const firstOutputData = step.o?.[0].d;
          const hasNoOutputData = numOutputs > 0 && step.o?.every(({ d }) => d === undefined);
          const showPreview =
            numOutputs === 1 && ["boolean", "number", "string"].includes(typeof firstOutputData);
          const showDetails = !showPreview && !hasNoOutputData;
          const preview = showPreview ? String(firstOutputData) : "";

          return (
            <details
              key={i}
              className="cursor-default hover:bg-zinc-100 hover:dark:bg-zinc-800 transition-colors"
            >
              <summary
                className={`flex gap-2 py-1
              ${showDetails ? "cursor-pointer" : ""}
              `}
              >
                <span className="pl-2 text-gray-500 w-8">{i}</span>
                <span>{kind}</span>
                {showPreview && <span>{preview}</span>}
                {showDetails && <span className="text-primary-800">•</span>}
              </summary>

              {showDetails && (
                <div className="py-1 flex flex-col gap-2">
                  {step.o?.map(({ d }, i) => (
                    <pre key={i} className="pl-10 hover:bg-zinc-200 hover:dark:bg-zinc-900">
                      <code>{JSON.stringify(d ?? null, null, 2)}</code>
                    </pre>
                  ))}
                </div>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
};
