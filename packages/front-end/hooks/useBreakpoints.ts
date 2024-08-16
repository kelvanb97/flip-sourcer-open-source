import { useEffect, useState } from "react";

interface Breakpoints {
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
  width: number;
}

const useBreakpoints = (): Breakpoints => {
  const [width, setWidth] = useState<number | undefined>(undefined);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    if (width === undefined) handleWindowSizeChange();
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isDesktop = width ? width > 1024 : false;
  const isTablet = width ? width <= 1024 && width > 768 : false;
  const isMobile = width ? width <= 768 : false;

  return { isDesktop, isTablet, isMobile, width: width || 0 };
};

export default useBreakpoints;
