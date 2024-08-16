import {
  As,
  Box,
  Button as ChakraButton,
  Icon,
  ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";
import { CSSProperties } from "react";
import { brandDarkertLightBlue } from "../../theme";

type ButtonProps = {
  flavor?: "default" | "outline" | "transparent" | "link";
  icon?: As;
  iconPosition?: "left" | "right";
  iconStyle?: CSSProperties;
  children: React.ReactNode;
} & ChakraButtonProps;

export default function Button({
  flavor = "default",
  size = "md",
  icon,
  iconPosition,
  rounded = "4px",
  height = "36px",
  fontSize = "sm",
  px = 8,
  color = "white",
  bg = "dodgerblue",
  shadow = "dark-lg",
  _hover = { bgColor: brandDarkertLightBlue },
  iconStyle,
  children,
  ...buttonProps
}: ButtonProps) {
  if (flavor === "default") {
    //do nothing
  } else if (flavor === "outline") {
    bg = "transparent";
    _hover = { bgColor: "rgba(255, 255, 255, 0.2)" };
    buttonProps.borderColor = buttonProps.borderColor || "white";

    if (size === "lg") {
      buttonProps.border = "2px solid";
    } else {
      buttonProps.border = "1px solid";
    }
  } else if (flavor === "transparent") {
    bg = "transparent";
    shadow = "none";
    _hover = { bgColor: "rgba(255, 255, 255, 0.2)" };
  } else if (flavor === "link") {
    bg = "transparent";
    shadow = "none";
    _hover = { bgColor: "transparent", textDecoration: "underline" };
  }

  if (size === "xs") {
    height = "28px";
    fontSize = "xs";
    px = 4;
  } else if (size === "sm") {
    height = "32px";
    fontSize = "sm";
    px = 6;
  } else if (size === "md") {
    //do nothing
  } else if (size === "lg") {
    height = "48px";
    fontSize = "lg";
    px = 10;
  }

  return (
    <ChakraButton
      rounded={rounded}
      h={height}
      fontSize={fontSize}
      px={px}
      color={color}
      bg={bg}
      shadow={shadow}
      _hover={_hover}
      {...buttonProps}
    >
      <>
        {iconPosition === "left" && icon && (
          <Box my={"auto"}>
            <Icon
              as={icon}
              boxSize={height}
              color={color}
              p={2}
              style={iconStyle}
            />
          </Box>
        )}
        <Box my="auto">{children}</Box>
        {iconPosition === "right" && icon && (
          <Box my={"auto"}>
            <Icon
              as={icon}
              boxSize={height}
              color={color}
              p={2}
              style={iconStyle}
            />
          </Box>
        )}
      </>
    </ChakraButton>
  );
}
