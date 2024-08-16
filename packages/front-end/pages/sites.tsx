import { Box } from "@chakra-ui/react";
import { marginX } from "../theme";
import SupportedSites from "../components/home/SupportedSites";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";

export default function SitesPage() {
  return (
    <Box>
      <Box className="gradient_bg_light_to_dark">
        <Box mx={marginX}>
          <Header showPb={false} />
        </Box>
      </Box>
      <Box py={24}>
        <Box mx={marginX}>
          <SupportedSites />
        </Box>
      </Box>
      <Box className="gradient_bg_light_to_dark">
        <Box mx={marginX} mt={32}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
