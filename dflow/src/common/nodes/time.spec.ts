import { DflowExecutorMock } from "../mocks/executor.js";

describe("today", () => {
  it("reads context timestamp", async () => {
    const day = "1978-12-31";
    const nodeId = "a";
    const executor = new DflowExecutorMock({
      view: {
        nodes: [
          {
            id: nodeId,
            text: "today",
          },
        ],
        edges: [],
      },
    });
    await executor.prepare();
    const { execution } = await executor.run({
      memory: {},
      timestamp: new Date(day).toJSON(),
    });
    expect(
      execution?.steps?.find(({ id }) => id === nodeId)?.outputs?.[0]?.data
    ).toBe(day);
  });
});
