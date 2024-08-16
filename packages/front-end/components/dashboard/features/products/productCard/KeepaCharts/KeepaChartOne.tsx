import { ProductInterface } from "../../../../../../../types/Product";
import React, { useMemo } from "react";
import { ChartOptions, Scale } from "chart.js";
import { Chart } from "react-chartjs-2";
import moment from "moment";
import "chartjs-adapter-moment";
import { Box } from "@chakra-ui/react";
import {
  chartAreaBorder,
  chartAreaBorderPlugin,
  ChartOptionsWithPlugins,
  filler,
  hover,
  interaction,
  legend,
  tooltip,
} from "./keepaChartConstants";
import { toDisplayNumber } from "../../../../../../utils/shared";
import { truckEmoji } from "../../../../../../utils/constants";

interface KeepaChartOneProps {
  product: ProductInterface;
  height: number;
  displayDays: 7 | 30 | 90 | 180;
}

export default function KeepaChartOne({
  product,
  height,
  displayDays,
}: KeepaChartOneProps) {
  function getLabels() {
    const startDate = moment().subtract(displayDays, "days");
    const endDate = moment();

    const chartDataXVals = [];
    for (let i = 0; i < displayDays; i++) {
      const date = moment(startDate).add(i, "days");
      if (date.isSameOrBefore(endDate)) {
        chartDataXVals.push(date);
      }
    }
    return chartDataXVals;
  }

  const options: ChartOptionsWithPlugins = {
    responsive: true,
    maintainAspectRatio: false,
    borderColor: "black",
    scales: {
      x: {
        type: "time",
        time: {
          displayFormats: {
            hour: "MMM D",
            day: "MMM D",
          },
        },
        min: moment().subtract(displayDays, "days").valueOf(),
        max: moment().valueOf(),
        ticks: {
          padding: 2,
          maxTicksLimit: 9,
        },
        grid: { drawTicks: false },
      },
      price: {
        type: "linear",
        position: "left",
        grace: "5%",
        ticks: {
          padding: 5,
          maxTicksLimit: 5,
          callback: (tickValue: string | number) => `$${tickValue}`,
        },
        grid: { drawTicks: false },
        afterFit: (scale: { width: number }) => {
          scale.width = 50;
        },
      },
      salesRank: {
        type: "linear",
        position: "right",
        grace: "5%",
        ticks: {
          padding: 5,
          maxTicksLimit: 4,
          callback: (tickValue: string | number) =>
            `#${toDisplayNumber(parseFloat(tickValue.toString()))}`,
        },
        grid: {
          drawTicks: false,
          drawOnChartArea: false,
        },
        display: true,
        afterFit: (scale: Scale) => {
          if (scale.options.display) scale.width = 70;
          //if the scale is hidden, remove 2x the padding for the scale
          else scale.width = 60;
        },
      },
    },
    interaction,
    hover,
    plugins: {
      chartAreaBorder: chartAreaBorderPlugin,
      filler,
      tooltip: {
        ...tooltip,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) => {
            if (ctx.dataset.label !== "Sales Rank") {
              const value = ctx.dataset.data[ctx.dataIndex].y;
              return `${ctx.dataset.label}: $${value.toFixed(2)}`;
            }
          },
        },
      },
      legend,
    },
  };

  const data = useMemo(() => {
    return {
      type: "line",
      labels: getLabels(),
      datasets: [
        {
          label: "Sales Rank",
          yAxisID: "salesRank",
          borderColor: "#8FBC8F",
          backgroundColor: "#8FBC8F",
          borderWidth: 2,
          pointRadius: 0,
          data: product.chartData.salesRank,
        },
        {
          label: `Buy Box ${truckEmoji}`,
          yAxisID: "price",
          borderColor: "#FF00B4",
          backgroundColor: "#FF00B4",
          borderWidth: 2,
          pointRadius: 0,
          drawLine: true,
          spanGaps: false,
          data: product.chartData.buyBox,
        },
        {
          label: "Amazon",
          yAxisID: "price",
          fill: {
            target: "origin",
            above: "rgb(255, 229, 203, 0.5)",
            below: "rgb(255, 229, 203, 0.5)",
          },
          borderColor: "orange",
          backgroundColor: "#FFE5CB",
          borderWidth: 1,
          pointRadius: 0,
          drawLine: true,
          spanGaps: false,
          data: product.chartData.amazon,
        },
        {
          label: "New",
          yAxisID: "price",
          borderColor: "#8888DD",
          backgroundColor: "#8888DD",
          borderWidth: 2,
          pointRadius: 0,
          drawLine: true,
          spanGaps: false,
          data: product.chartData.new,
        },
        {
          label: "New, 3rd Party FBA",
          yAxisID: "price",
          borderColor: "#FF5722",
          backgroundColor: "#ffffff",
          pointStyle: "triangle",
          borderWidth: 1,
          pointRadius: 5,
          showLine: false,
          drawLine: false,
          spanGaps: false,
          data: product.chartData.new3rdPartyFba,
        },
        {
          label: `New, 3rd Party FBM ${truckEmoji}`,
          yAxisID: "price",
          borderColor: "#039BE5",
          backgroundColor: "#ffffff",
          pointStyle: "rect",
          borderWidth: 1,
          pointRadius: 5,
          showLine: false,
          drawLine: false,
          spanGaps: false,
          data: product.chartData.new3rdPartyFbm,
        },
        {
          label: `Buy Box Used ${truckEmoji}`,
          yAxisID: "price",
          borderColor: "#DA66FF",
          backgroundColor: "#ffffff",
          pointStyle: "rectRot",
          borderWidth: 1,
          pointRadius: 4,
          showLine: false,
          drawLine: false,
          spanGaps: false,
          data: product.chartData.buyBoxUsed,
        },
        {
          label: "Used",
          yAxisID: "price",
          borderColor: "#4C4C4C",
          backgroundColor: "#4C4C4C",
          borderWidth: 2,
          pointRadius: 0,
          drawLine: true,
          spanGaps: false,
          data: product.chartData.used,
        },
        {
          label: `Used, like new ${truckEmoji}`,
          yAxisID: "price",
          borderColor: "#444444",
          backgroundColor: "#ffffff",
          borderWidth: 1,
          pointRadius: 3,
          showLine: false,
          drawLine: false,
          spanGaps: false,
          data: product.chartData.usedLikeNew,
        },
        {
          label: `Used, very good ${truckEmoji}`,
          yAxisID: "price",
          borderColor: "#009678",
          backgroundColor: "#ffffff",
          pointStyle: "rectRot",
          borderWidth: 1,
          pointRadius: 4,
          showLine: false,
          drawLine: false,
          spanGaps: false,
          data: product.chartData.usedVeryGood,
        },
        {
          label: `Used, good ${truckEmoji}`,
          yAxisID: "price",
          borderColor: "#795548",
          backgroundColor: "#ffffff",
          pointStyle: "triangle",
          borderWidth: 1,
          pointRadius: 4,
          showLine: false,
          drawLine: false,
          spanGaps: false,
          data: product.chartData.usedGood,
        },
        {
          label: `Used, acceptable ${truckEmoji}`,
          yAxisID: "price",
          borderColor: "#9E9E9E",
          backgroundColor: "#ffffff",
          pointStyle: "rect",
          borderWidth: 1,
          pointRadius: 5,
          showLine: false,
          drawLine: false,
          spanGaps: false,
          data: product.chartData.usedAcceptable,
        },
        {
          label: "Warehouse Deals",
          yAxisID: "price",
          borderColor: "#9C27B0",
          backgroundColor: "#ffffff",
          pointStyle: "crossRot",
          borderWidth: 1,
          pointRadius: 4,
          showLine: false,
          drawLine: false,
          spanGaps: false,
          data: product.chartData.warehouseDeals,
        },
        {
          label: "Collectible",
          yAxisID: "price",
          borderColor: "#B0C4DE",
          backgroundColor: "#B0C4DE",
          borderWidth: 2,
          pointRadius: 0,
          drawLine: true,
          spanGaps: false,
          data: product.chartData.collectible,
        },
        {
          label: "List Price",
          yAxisID: "price",
          borderColor: "#8B4513",
          backgroundColor: "#8B4513",
          borderWidth: 2,
          pointRadius: 0,
          drawLine: true,
          spanGaps: false,
          data: product.chartData.listPrice,
        },
        {
          label: "Retailer",
          yAxisID: "price",
          borderColor: "purple",
          backgroundColor: "purple",
          borderWidth: 2,
          pointRadius: 0,
          drawLine: true,
          spanGaps: false,
          data: product.chartData.retailer,
        },
      ],
    };
  }, [displayDays]);

  return (
    <Box height={height}>
      <Chart
        type="line"
        data={data}
        options={options as ChartOptions}
        plugins={[chartAreaBorder]}
      />
    </Box>
  );
}
