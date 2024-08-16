import { Box, Flex, Tooltip, chakra } from "@chakra-ui/react";
import { useContext, useState } from "react";
import Logo, { getLogoSrc } from "../shared/Logo";
import { FiSettings, FiLogOut, FiUser, FiMenu } from "react-icons/fi";
import { useRouter } from "next/router";
import { logout } from "../../utils/auth";
import Button from "../shared/Button";
import { BsSuitHeart, BsLightningCharge } from "react-icons/bs";
import SidebarElem from "./SidebarElem";
import { HiMoon, HiSun } from "react-icons/hi";
import { DarkModeContext } from "../../providers/DarkModeProvider";
import mixpanelAnalytics from "../../utils/analytics/mixpanelAnalytics";
import googleAnalytics from "../../utils/analytics/googleAnalytics";
import { AiOutlineHome, AiOutlineQuestionCircle } from "react-icons/ai";
import { PaperCupsContext } from "../../providers/PaperCupsProvider";
import GuidedTourButton from "./GuidedTourButton";
import facebookAnalytics from "../../utils/analytics/facebookAnalytics";

interface SidebarProps {
  isDesktop: boolean;
}

export default function Sidebar({ isDesktop }: SidebarProps) {
  const { openChat } = useContext(PaperCupsContext);
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

  function handleLogout() {
    mixpanelAnalytics.trackEvent("Log Out", { page: router.pathname });
    googleAnalytics.trackEvent("User", "Log Out");
    facebookAnalytics.trackEvent("Log Out");
    logout();
  }

  return (
    <Flex
      maxH="100vh"
      minH="100vh"
      bg="gray.800"
      direction="column"
      maxW={"max-content"}
      minW={"max-content"}
      justifyContent="space-between"
    >
      <Flex direction={"column"} flex={1}>
        <Flex
          direction="row"
          justifyContent={"space-between"}
          bg="gray.900"
          py={2}
          px={4}
        >
          <Tooltip
            label={sidebarOpen ? "Close Menu" : "Open Menu"}
            placement="right"
            bg="white"
            color="black"
            fontSize="md"
            hasArrow
          >
            <Box
              onClick={() => setSidebarOpen(!sidebarOpen)}
              rounded="md"
              _hover={{ bg: "gray.700" }}
            >
              <FiMenu color="white" size="32px" cursor="pointer" />
            </Box>
          </Tooltip>
          {sidebarOpen && (
            <Box height={"32px"} rounded="md" px={2}>
              <Logo
                src={getLogoSrc("logoNameBlue")}
                width={211}
                height={32}
                style={{ cursor: "default" }}
              />
            </Box>
          )}
        </Flex>
        <Flex
          direction="column"
          justifyContent="space-between"
          flex={1}
          my={3}
          px={2}
        >
          <Flex direction="column" rowGap={3}>
            <SidebarElem
              label="Home"
              icon={
                <AiOutlineHome color="white" size="22px" cursor="pointer" />
              }
              active={router.pathname === "/dashboard"}
              onClick={() => router.push("/dashboard")}
              sidbarOpen={sidebarOpen}
            />
            <hr />
            <SidebarElem
              label="Find Products"
              icon={
                <BsLightningCharge color="white" size="22px" cursor="pointer" />
              }
              active={router.pathname.includes("/dashboard/features/products")}
              onClick={() => router.push("/dashboard/features/products")}
              sidbarOpen={sidebarOpen}
            />
            <SidebarElem
              label="Saved Products"
              icon={<BsSuitHeart color="white" size="22px" cursor="pointer" />}
              active={router.pathname.includes(
                "/dashboard/features/saved-products"
              )}
              onClick={() => router.push("/dashboard/features/saved-products")}
              sidbarOpen={sidebarOpen}
            />
            <hr />
            <SidebarElem
              label="Settings"
              icon={<FiSettings color="white" size="22px" cursor="pointer" />}
              active={router.pathname.includes("/dashboard/settings/general")}
              onClick={() => router.push("/dashboard/settings/general")}
              sidbarOpen={sidebarOpen}
            />
          </Flex>
          <Flex direction="column" rowGap={1}>
            <GuidedTourButton sidebarOpen={sidebarOpen} router={router} />
          </Flex>
        </Flex>
      </Flex>
      <Flex direction="column" rowGap={1} bg="gray.900" px={2} py={3}>
        <SidebarElem
          label="Support"
          icon={
            <AiOutlineQuestionCircle
              color="white"
              size="22px"
              cursor="pointer"
            />
          }
          active={false}
          onClick={() => openChat()}
          sidbarOpen={sidebarOpen}
        />
        <SidebarElem
          label="Account"
          icon={<FiUser color="white" size="22px" cursor="pointer" />}
          active={router.pathname.includes("/dashboard/account")}
          onClick={() => router.push("/dashboard/account")}
          sidbarOpen={sidebarOpen}
        />
        <SidebarElem
          label="Logout"
          icon={<FiLogOut color="white" size="22px" cursor="pointer" />}
          active={false}
          onClick={() => handleLogout()}
          sidbarOpen={sidebarOpen}
        />
        <Tooltip
          label={isDarkMode ? "Light Mode" : "Dark Mode"}
          placement="right"
          bg="white"
          color="black"
          fontSize="md"
          hasArrow
        >
          <chakra.span>
            <Button
              minW="100%"
              size="xs"
              icon={sidebarOpen ? (isDarkMode ? HiSun : HiMoon) : undefined}
              iconPosition={"left"}
              fontWeight={"normal"}
              pl={sidebarOpen ? 0 : undefined}
              bg="gray.700"
              _hover={{ bg: "gray.500" }}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {sidebarOpen ? (
                isDarkMode ? (
                  "Light Mode"
                ) : (
                  "Dark Mode"
                )
              ) : isDarkMode ? (
                <HiSun />
              ) : (
                <HiMoon />
              )}
            </Button>
          </chakra.span>
        </Tooltip>
      </Flex>
    </Flex>
  );
}
