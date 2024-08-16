import {
  Box,
  Flex,
  FlexProps,
  Heading,
  Radio,
  RadioGroup,
  chakra,
} from "@chakra-ui/react";
import { ProductInterface } from "../../../../../../../types/Product";
import { useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Filler,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-moment";
import KeepaChartOne from "./KeepaChartOne";
import KeepaChartTwo from "./KeepaChartTwo";
import Loader from "../../../../../shared/Loader";

type KeepaChartsProps = {
  product: ProductInterface;
  keepaDataLoading: boolean;
  graphOneHeight: number;
  graphTwoHeight: number;
} & FlexProps;

export default function KeepaCharts({
  product,
  keepaDataLoading,
  graphOneHeight,
  graphTwoHeight,
  ...props
}: KeepaChartsProps) {
  ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    Filler,
    TimeScale
  );
  const [displayDays, setDisplayDays] = useState<7 | 30 | 90 | 180>(30);

  return (
    <Flex flexDir="column" {...props}>
      <Heading size="md" mb={2}>
        Keepa Charts
      </Heading>
      {keepaDataLoading ? (
        <Loader />
      ) : (
        <Box mt={3}>
          <KeepaChartOne
            product={product}
            height={graphOneHeight}
            displayDays={displayDays}
          />
          <KeepaChartTwo
            product={product}
            height={graphTwoHeight}
            displayDays={displayDays}
          />
          <RadioGroup
            value={displayDays.toString()}
            display="flex"
            columnGap={3}
            justifyContent="center"
          >
            <Radio
              value={"7"}
              onChange={() => setDisplayDays(7)}
              checked={displayDays === 7}
            >
              <chakra.span fontSize={"xs"}>7 days</chakra.span>
            </Radio>
            <Radio
              value={"30"}
              onChange={() => setDisplayDays(30)}
              checked={displayDays === 30}
            >
              <chakra.span fontSize={"xs"}>30 days</chakra.span>
            </Radio>
            <Radio
              value={"90"}
              onChange={() => setDisplayDays(90)}
              checked={displayDays === 90}
            >
              <chakra.span fontSize={"xs"}>90 days</chakra.span>
            </Radio>
            <Radio
              value={"180"}
              onChange={() => setDisplayDays(180)}
              checked={displayDays === 180}
            >
              <chakra.span fontSize={"xs"}>180 days</chakra.span>
            </Radio>
          </RadioGroup>
        </Box>
      )}
    </Flex>
  );
}
