import { ProductInterface } from "../../../../../../../types/Product";
import React, { useMemo } from "react";
import { ChartOptions } from "chart.js";
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

interface KeepaChartTwoProps {
  product: ProductInterface;
  height: number;
  displayDays: 7 | 30 | 90 | 180;
}

export default function KeepaChartTwo({
  product,
  height,
  displayDays,
}: KeepaChartTwoProps) {
  function getLabels() {
    const startDate = moment().subtract(displayDays, "days");
    const endDate = moment();

    return [startDate, endDate];
  }

  const options: ChartOptionsWithPlugins = {
    responsive: true,
    maintainAspectRatio: false,
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
          display: false,
        },
        grid: { drawTicks: false },
      },
      left: {
        type: "linear",
        position: "left",
        grace: "5%",
        ticks: {
          padding: 5,
          maxTicksLimit: 3,
          //hack: helps with alignment with other graph
          callback: (tickValue: string | number) => `  ${tickValue}`,
        },
        grid: {
          drawTicks: false,
          drawOnChartArea: false,
        },
        afterFit: (scale: { width: number }) => {
          scale.width = 50;
        },
      },
      right: {
        type: "linear",
        position: "right",
        grace: "5%",
        ticks: {
          padding: 5,
          maxTicksLimit: 6,
        },
        grid: { drawTicks: false },
        afterFit: (scale: { width: number }) => {
          scale.width = 70;
        },
      },
    },
    interaction,
    hover,
    plugins: {
      chartAreaBorder: chartAreaBorderPlugin,
      filler,
      tooltip,
      legend,
    },
  };

  const data = useMemo(() => {
    return {
      type: "line",
      labels: getLabels(),
      datasets: [
        {
          label: "rating",
          yAxisID: "right",
          borderColor: "#009688",
          backgroundColor: "#009688",
          borderWidth: 2,
          pointRadius: 0,
          drawLine: true,
          spanGaps: false,
          data: product.chartData.rating,
        },
        {
          label: "review count",
          yAxisID: "left",
          borderColor: "#8AB300",
          backgroundColor: "#8AB300",
          borderWidth: 2,
          pointRadius: 0,
          drawLine: true,
          spanGaps: false,
          data: product.chartData.reviewCount,
        },
        {
          label: "new offer count",
          yAxisID: "right",
          borderColor: "#8888DD",
          backgroundColor: "#8888DD",
          borderWidth: 2,
          pointRadius: 0,
          drawLine: true,
          spanGaps: false,
          data: product.chartData.newOfferCount,
        },
        {
          label: "used offer count",
          yAxisID: "right",
          borderColor: "#4C4C4C",
          backgroundColor: "#4C4C4C",
          borderWidth: 2,
          pointRadius: 0,
          drawLine: true,
          spanGaps: false,
          data: product.chartData.usedOfferCount,
        },
        {
          label: "Collectible offer count",
          yAxisID: "right",
          borderColor: "#DDE9FB",
          backgroundColor: "#DDE9FB",
          borderWidth: 2,
          pointRadius: 0,
          drawLine: true,
          spanGaps: false,
          data: product.chartData.collectibleOfferCount,
        },
      ],
    };
  }, [displayDays]);

  return (
    <Box height={height} w={"100%"}>
      <Chart
        type="line"
        data={data}
        options={options as ChartOptions}
        plugins={[chartAreaBorder]}
      />
    </Box>
  );
}
