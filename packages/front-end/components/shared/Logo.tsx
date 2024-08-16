import Image, { ImageProps } from "next/image";

type LogoType =
  | "logo"
  | "icon"
  | "top_bottom"
  | "logoNameBlack"
  | "logoNameWhite"
  | "logoNameBlue"
  | "logoAllWhite";

export function getLogoSrc(type: LogoType = "logo") {
  return `/images/branding/${type}.svg`;
}

type LogoProps = {
  src: string;
  alt?: string;
  style?: object;
} & ImageProps;

export default function Logo({
  src = "/images/branding/logo.svg",
  alt = "logo",
  style = { cursor: "pointer" },
  ...props
}: LogoProps) {
  return <Image src={src} alt={alt} style={style} {...props} />;
}
