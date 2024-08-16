import {
  BubbleDataPoint,
  Chart,
  ChartOptions,
  ChartTypeRegistry,
  Color,
  CoreInteractionOptions,
  LegendOptions,
  Point,
  TooltipOptions,
  LegendItem,
  ChartEvent,
  LegendElement,
} from "chart.js";
import { _DeepPartialObject } from "chart.js/dist/types/utils";

export type ChartOptionsWithPlugins = ChartOptions & {
  plugins: {
    chartAreaBorder: {
      borderColor: string;
      borderWidth: number;
    };
  };
};

//Options
export const interaction: _DeepPartialObject<CoreInteractionOptions> = {
  intersect: false,
  mode: "index",
};

export const hover: _DeepPartialObject<CoreInteractionOptions> = {
  mode: "nearest",
  intersect: true,
};

//Plugins
export const chartAreaBorder = {
  id: "chartAreaBorder",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beforeDraw(chart: any, _args: any, options: any) {
    const {
      ctx,
      chartArea: { left, top, width, height },
    } = chart;
    ctx.save();
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.strokeRect(left, top, width, height);
    ctx.restore();
  },
};

export const legend: _DeepPartialObject<
  LegendOptions<keyof ChartTypeRegistry>
> = {
  position: "right",
  align: "start",
  labels: {
    usePointStyle: true,
    pointStyle: "circle",
    boxHeight: 7,
    boxWidth: 7,
    padding: 7,
    generateLabels: function (
      chart: Chart<
        keyof ChartTypeRegistry,
        (number | [number, number] | Point | BubbleDataPoint | null)[],
        unknown
      >
    ): LegendItem[] {
      const datasets = chart.data.datasets;
      return datasets.map((dataset, index) => {
        const meta = chart.getDatasetMeta(index);
        const isHidden = meta.hidden;
        const pointStyle = isHidden ? "line" : "circle";
        const color = isHidden ? "gray" : dataset.borderColor;

        return {
          text: dataset.label as string,
          fillStyle: color as Color,
          strokeStyle: color as Color,
          hidden: false,
          datasetIndex: index,
          pointStyle: pointStyle,
          // Extra data used for toggling the datasets
          index: index,
        };
      });
    },
  },
  onClick: function (
    this: LegendElement<keyof ChartTypeRegistry>,
    _e: ChartEvent,
    legendItem: LegendItem,
    legend: LegendElement<keyof ChartTypeRegistry>
  ) {
    const index = legendItem.index;
    const chart = legend.chart;
    const meta = chart.getDatasetMeta(index as number);

    meta.hidden = !meta.hidden;

    //Hide the sales rank scale if the salesRank dataset is hidden
    if (meta.label === "Sales Rank")
      if (chart?.options?.scales?.salesRank)
        chart.options.scales.salesRank.display = !meta.hidden;

    chart.update();
  },
};

export const tooltip: _DeepPartialObject<
  TooltipOptions<keyof ChartTypeRegistry>
> = {
  enabled: true,
  position: "nearest",
  intersect: false,
};

export const filler = {
  propagate: true,
};

export const chartAreaBorderPlugin = {
  borderColor: "black",
  borderWidth: 1,
};
