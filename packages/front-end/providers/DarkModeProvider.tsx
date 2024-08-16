import { createContext, useEffect, useState } from "react";
import { getLocalStorageVar, setLocalStorageVar } from "../utils/localstorage";

interface DarkModeProviderProps {
  children: React.ReactNode;
}

export const DarkModeContext = createContext({
  isDarkMode: false,
  setIsDarkMode: (isDarkMode: boolean) => {
    isDarkMode;
  },
  darkModeColor: "black",
});

export default function DarkModeProvider({ children }: DarkModeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    getLocalStorageVar("isDarkMode") === "true"
  );
  const [darkModeColor, setDarkModeColor] = useState<"white" | "black">(
    "black"
  );

  useEffect(() => {
    setLocalStorageVar("isDarkMode", isDarkMode ? "true" : "false");
    setDarkModeColor(isDarkMode ? "white" : "black");
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider
      value={{ isDarkMode, setIsDarkMode, darkModeColor }}
    >
      {children}
    </DarkModeContext.Provider>
  );
}
