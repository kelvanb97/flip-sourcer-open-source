import { Box, Heading } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getCookie, setCookie } from "../../utils/cookies";
import Modal from "../shared/Modal";

export default function CookieConsentPolicy() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(getCookie("c") === "true" ? false : true);
  }, []);

  function close() {
    setCookie("c", "true");
    setOpen(false);
  }

  return (
    <>
      {open && (
        <Modal close={close}>
          <Box bgColor={"white"} py={8} px={4} rounded={"lg"}>
            <Box mx={"auto"}>
              <Heading
                as="h2"
                textAlign={"center"}
                fontSize={"3xl"}
                fontWeight={"bold"}
              >
                Cookie Consent
              </Heading>
            </Box>
            <Box mx="auto" textAlign={"center"}>
              By continuing to use <strong>flipsourcer.com</strong> you agree to
              the use of cookies, to learn more about how we use cookies please
              refer to our{" "}
              <Link href="/privacy">
                <a style={{ textDecoration: "underline", color: "dodgerBlue" }}>
                  Privacy Policy
                </a>
              </Link>{" "}
              which includes information about how we use cookies.
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
}
