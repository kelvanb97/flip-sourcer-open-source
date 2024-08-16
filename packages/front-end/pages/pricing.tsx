import { Box } from "@chakra-ui/react";
import Pricing from "../components/home/Pricing";
import { marginX } from "../theme";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";

export default function PricingPage() {
  return (
    <Box>
      <Box className="gradient_bg_light_to_dark">
        <Box mx={marginX}>
          <Header showPb={false} />
        </Box>
      </Box>
      <Box pt={24} className="gradient_bg_light_to_dark">
        <Box mx={marginX}>
          <Pricing />
        </Box>
        <Box mx={marginX} mt={32}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
