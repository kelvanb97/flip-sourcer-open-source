import {
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Box } from "@chakra-ui/react";

interface ModalProps {
  id?: string;
  close: () => void;
  scrollBehavior?: "inside" | "outside";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  closeOnOverlayClick?: boolean;
  showX?: boolean;
  showModalOverlay?: boolean;
  children: React.ReactNode;
}

export default function Modal({
  id,
  close,
  scrollBehavior = "inside",
  size = "2xl",
  closeOnOverlayClick = true,
  showX = true,
  showModalOverlay = true,
  children,
}: ModalProps) {
  return (
    <ChakraModal
      id={id}
      isOpen={true}
      onClose={() => close()}
      isCentered
      scrollBehavior={scrollBehavior}
      size={size}
      closeOnOverlayClick={closeOnOverlayClick}
    >
      {showModalOverlay && <ModalOverlay />}
      <ModalContent mx={6}>
        <ModalBody py={5} className="no_scrollbar">
          {showX && (
            <Box
              cursor={"pointer"}
              fontSize={"3xl"}
              position={"absolute"}
              right={0}
              top={0}
              // mt={-8}
              mr={3}
              fontWeight={"bold"}
              _hover={{ color: "gray" }}
              onClick={() => close()}
            >
              &times;
            </Box>
          )}
          {children}
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
}
