import { Box } from "@chakra-ui/react";
import { brandDarkBlue, marginX } from "../../theme";
import CallToAction from "./CallToAction";
import Footer from "./Footer";
import Header from "./Header";
import Pricing from "./Pricing";
import Stats from "./Stats";
import RightLeftSections from "./RightLeftSections";
import SupportedSites from "./SupportedSites";
import InstantResults from "./InstantResults";

export default function Home() {
  return (
    <Box>
      <Box className="gradient_bg_light_to_dark">
        <Box mx={marginX}>
          <Header />
        </Box>
        <Box pb={32} mx={marginX}>
          <CallToAction />
        </Box>
      </Box>
      <Box bg={brandDarkBlue}>
        <Box mx={marginX}>
          <Stats />
        </Box>
      </Box>
      <Box pt={48}>
        <Box mx={marginX}>
          <InstantResults />
        </Box>
      </Box>
      <Box pt={48} pb={24}>
        <Box mx={marginX}>
          <SupportedSites limitResults={true} />
        </Box>
      </Box>
      <Box pt={24} pb={48}>
        <Box mx={marginX}>
          <RightLeftSections />
        </Box>
      </Box>
      <Box pt={48} className="gradient_bg_light_to_dark">
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
