import { listObjects } from "@ggbot2/aws";
import { ReadStrategySchedulingList } from "@ggbot2/models";

export function strategySchedulingDirnamePrefix() {
  return "strategyScheduling";
}

export const readStrategySchedulingList: ReadStrategySchedulingList["resolver"] =
  async () => {
    const Prefix = strategySchedulingDirnamePrefix();
    const results = await listObjects({
      Prefix,
    });
    if (!Array.isArray(results.Contents)) return Promise.resolve([]);
    return (
      results.Contents.reduce<string[]>((list, { Key }) => {
        if (typeof Key !== "string") return list;
        return list.concat(Key);
      }, []) ?? []
    );
  };
