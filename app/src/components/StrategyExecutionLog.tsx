import { DateTime, Tag, TagProps } from "@ggbot2/design";
import { StrategyExecution } from "@ggbot2/models";
import { FC } from "react";

type Props = Partial<
  Pick<StrategyExecution, "status" | "steps" | "whenUpdated">
>;

export const StrategyExecutionLog: FC<Props> = ({
  status,
  steps,
  whenUpdated,
}) => {
  let tagColor: TagProps["color"] | undefined;

  if (status === "success") tagColor = "primary";
  if (status === "failure") tagColor = "danger";

  return (
    <div>
      <div>
        <span>Execution</span>

        <div>{tagColor ? <Tag color={tagColor}>{status}</Tag> : null}</div>
      </div>

      <div>
        <DateTime format="time" value={whenUpdated} />
      </div>

      <div>
        {steps?.map((step, i) => {
          const kind = step.k;
          const numOutputs = step.o?.length ?? 0;
          const firstOutputData = step.o?.[0].d;
          const hasNoOutputData =
            numOutputs > 0 && step.o?.every(({ d }) => d === undefined);
          const showPreview =
            numOutputs === 1 &&
            ["boolean", "number", "string"].includes(typeof firstOutputData);
          const showDetails = !showPreview && !hasNoOutputData;
          const preview = showPreview ? String(firstOutputData) : "";

          return (
            <details key={step.id}>
              <summary>
                <span>{i}</span>

                <span>{kind}</span>

                {showPreview ? <span>{preview}</span> : null}

                {showDetails ? <span>•</span> : null}
              </summary>

              {showDetails ? (
                <div>
                  {step.o?.map(({ d, id }) => (
                    <pre key={id}>
                      <code>{JSON.stringify(d ?? null, null, 2)}</code>
                    </pre>
                  ))}
                </div>
              ) : null}
            </details>
          );
        })}
      </div>
    </div>
  );
};
