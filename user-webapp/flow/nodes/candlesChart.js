import { FlowViewNode } from "flow-view";
import { createChart, ColorType } from "lightweight-charts";

export class FlowViewNodeCandlesChart extends FlowViewNode {
  static type = "candlesChart";

  static style = {
    ".container": {
      border: "1px solid",
    },
  };

  initContent() {
    const height = 250;
    const width = Math.floor(1.618 * height); // Golden ratio.
    const backgroundColor = "transparent";
    const textColor = "black";
    const green = "rgb(38,166,154)";
    const red = "rgb(255,82,82)";

    const container = this.createElement("div", "container");
    container.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width,
      height,
    });
    this.chart = chart;
    this.candles = chart.addCandlestickSeries({
      upColor: green,
      downColor: red,
      wickUpColor: green,
      wickDownColor: red,
      borderVisible: false,
    });
    // TODO why need to set this data?
    this.candles.setData([
      { time: "2022-10-01", open: 10, high: 20, low: 5, close: 15 },
      { time: "2022-10-02", open: 10, high: 20, low: 5, close: 15 },
      { time: "2022-10-03", open: 10, high: 20, low: 5, close: 15 },
      { time: "2022-10-04", open: 10, high: 20, low: 5, close: 15 },
    ]);
  }

  dispose() {
    if (this.chart) this.chart.remove();
    super.dispose();
  }
}
