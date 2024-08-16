import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { marginX } from "../theme";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import Card from "../components/shared/Card";

const aboutUsPx = ["20%"];

export default function AboutUs() {
  return (
    <Box color="white">
      {/* HEADER + OUR MISSION */}
      <Box className="gradient_bg_light_to_dark">
        <Box mx={marginX}>
          <Header showPb={false} />
        </Box>
        <Box py={24} mx={marginX} px={aboutUsPx} textAlign="center">
          <Heading fontSize={["5xl", "5xl", "6xl", "7xl"]} mb={24}>
            About Us
          </Heading>
          <Text color="gray.300" fontSize="lg" mb={4}>
            Our Mission
          </Text>
          <Heading size="2xl" mb={4}>
            To make sourcing efficient and effective.
          </Heading>
        </Box>
      </Box>
      {/* PHILOSOPHY */}
      <Box className="gradient_bg_dark_to_darker">
        <Box py={24} mx={marginX} px={aboutUsPx}>
          <Heading size="2xl" mb={4}>
            Philosophy
          </Heading>
          <Text>
            Sourcing, often riddled with tedious and repetitive tasks, presents
            a ripe opportunity for automation. At Flip Sourcer, we firmly
            believe in placing our customers at the heart of our innovation. By
            actively listening to their feedback and understanding their needs,
            we craft features tailored to propel their success.
          </Text>
        </Box>
      </Box>

      {/* THE TEAM + FOOTER */}
      <Box className="gradient_bg_light_to_dark">
        <Box py={24} mx={marginX} px={aboutUsPx}>
          <Heading size="2xl" mb={4} textAlign="center">
            The Team
          </Heading>
          <Card>
            <Flex justifyContent={"space-between"}>
              <Image
                src="/images/branding/kelvan_headshot.png"
                rounded="lg"
                width="300px"
              />
              <Box ml={8} color="black">
                <Heading size="lg" mb={1}>
                  Kelvan Brandt
                </Heading>
                <Text mb={4} fontSize="sm" color="gray.600">
                  - founder
                </Text>
                <Text mb={4}>
                  Kelvan is an ex-Amazon seller who ran into friction while
                  trying to scale his business. He founded Flip Sourcer to help
                  other sellers overcome the same challenges he faced.
                  <br />
                  <br />
                  With over a decade of experience in software development,
                  Kelvan is passionate about building technology that empowers
                  people to achieve their goals.
                </Text>
              </Box>
            </Flex>
          </Card>
        </Box>
        <Box mx={marginX}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
