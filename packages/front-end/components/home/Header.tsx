import { Box, Flex, HStack } from "@chakra-ui/react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import useBreakpoints from "../../hooks/useBreakpoints";
import { marginX } from "../../theme";
import Button from "../shared/Button";
import Logo, { getLogoSrc } from "../shared/Logo";
import { useRouter } from "next/router";
import { PaperCupsContext } from "../../providers/PaperCupsProvider";

interface HeaderProps {
  showPb?: boolean;
}

export default function Header({ showPb = true }: HeaderProps) {
  const { openChat } = useContext(PaperCupsContext);
  const { isMobile } = useBreakpoints();
  const router = useRouter();
  const [showHamburgerContents, setShowHamburgerContents] = useState(false);
  const [showExtraLinks, setShowExtraLinks] = useState(false);

  useEffect(() => {
    if (router.pathname === "/sign-up" || router.pathname === "/login") {
      setShowExtraLinks(false);
    } else {
      setShowExtraLinks(true);
    }
  }, [router.pathname]);

  return (
    <Box pb={showPb ? { base: "12", md: "24" } : ""}>
      <Box bg="bg-surface" py={5}>
        <HStack spacing="10" justify="space-between">
          <Link href={"/"}>
            <Logo
              src={getLogoSrc("logoAllWhite")}
              height={isMobile ? 32 : 47}
              width={isMobile ? 211 : 316}
            />
          </Link>
          {isMobile ? (
            <>
              <FiMenu
                size="32px"
                color="white"
                onClick={() => setShowHamburgerContents(!showHamburgerContents)}
              />
              {showHamburgerContents && (
                <Flex
                  position={"absolute"}
                  direction={"column"}
                  top={14}
                  right={marginX}
                  p={3}
                  rounded="md"
                  bgColor={"white"}
                  borderColor="gray.200"
                  borderWidth={"1px"}
                  zIndex={10000}
                  rowGap={2}
                >
                  <Link href="/login">
                    <Button flavor="outline" color="dodgerblue">
                      Login
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button>Sign up</Button>
                  </Link>
                </Flex>
              )}
            </>
          ) : (
            <Flex justify="end" flex="1">
              {showExtraLinks && (
                <>
                  <Link href="/sites">
                    <Button flavor="link">Sites</Button>
                  </Link>
                  <Link href="/about-us">
                    <Button flavor="link">About</Button>
                  </Link>
                  <Link href="/pricing">
                    <Button flavor="link">Pricing</Button>
                  </Link>
                  <Button onClick={() => openChat()} flavor="link">
                    Contact
                  </Button>
                </>
              )}
              <Link href="/login">
                <Button ml={3} flavor="outline">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button ml={3}>Sign up</Button>
              </Link>
            </Flex>
          )}
        </HStack>
      </Box>
    </Box>
  );
}
