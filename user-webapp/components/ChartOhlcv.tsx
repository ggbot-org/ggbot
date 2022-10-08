import { FC, useCallback, useEffect, useRef } from "react";
import type {
  IChartApi,
  ISeriesApi,
  OhlcData,
  SingleValueData,
} from "lightweight-charts";

export type ChartOhlcvProps = {
  candles: OhlcData[];
  volume: Array<SingleValueData & { up: boolean }>;
  height: number;
};

export const ChartOhlcv: FC<ChartOhlcvProps> = ({
  candles,
  volume,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const backgroundColor = "transparent";
  const textColor = "black";

  const greenBar = "rgb(38,166,117)";
  const redBar = "rgb(222,71,71)";
  const greenVolume = "rgba(38,166,140,0.71)";
  const redVolume = "rgba(255,82,82,0.71)";

  const importLibAndCreateChart = useCallback(async () => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const { createChart, ColorType } = await import("lightweight-charts");

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: container.clientWidth,
      height,
    });
    chartRef.current = chart;

    candlesRef.current = chart.addCandlestickSeries({
      upColor: greenBar,
      downColor: redBar,
      wickUpColor: greenBar,
      wickDownColor: redBar,
      borderVisible: false,
    });

    volumeRef.current = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "",
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
  }, [height, containerRef, chartRef, candlesRef, volumeRef]);

  const onResize = useCallback(() => {
    if (!chartRef.current) return;
    if (!containerRef.current) return;
    const chart = chartRef.current;
    const container = containerRef.current;
    const { width } = container.getBoundingClientRect();
    chart.applyOptions({ width });
  }, [chartRef, containerRef]);

  // Initialize chart.
  useEffect(() => {
    if (!containerRef.current) return;
    importLibAndCreateChart();
  }, [containerRef, importLibAndCreateChart]);

  // Handle resize.
  useEffect(() => {
    if (!onResize) return;
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  // Update data
  useEffect(() => {
    if (!candlesRef.current || !candles) return;
    candlesRef.current.setData(candles);
  }, [candles, candlesRef]);
  useEffect(() => {
    if (!volumeRef.current || !volume) return;
    volumeRef.current?.setData(
      volume.map(({ time, value, up }) => ({
        time,
        value,
        color: up ? greenVolume : redVolume,
      }))
    );
  }, [volume, volumeRef]);

  return <div ref={containerRef}></div>;
};
